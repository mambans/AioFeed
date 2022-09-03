import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import useToken, { TwitchContext } from '../useToken';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useForceRerender from '../../../hooks/useForceRerender';
import { fetchAndAddTags } from '../fetchAndAddTags';
import FeedSectionsContext from '../../feedSections/FeedSectionsContext';
import { checkAgainstRules } from '../../feedSections/FeedSections';
import Alert from '../../../components/alert';
import addProfileInfo from '../functions/addProfileInfo';
import addGameInfo from '../functions/addGameInfo';
import { CancelToken } from 'axios';
import LiveStreamsNotifications from './LiveStreamsNotifications';
import OfflineStreamsNotifications from './OfflineStreamsNotifications';
import UpdateStreamsNotifications from './UpdateStreamsNotifications';
import TwitchAPI, { pagination } from '../API';
import addSystemNotification from './addSystemNotification';

const REFRESH_RATE = 25; // seconds

const Handler = ({ children }) => {
  const { autoRefreshEnabled, twitchAccessToken, twitchUserId } = useContext(TwitchContext);
  const validateToken = useToken();
  const { feedSections } = useContext(FeedSectionsContext) || {};
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [liveStreamsState, setLiveStreamsState] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
    lastLoaded: false,
    rnd: Math.random(),
  });
  const liveStreams = useRef();
  const oldLiveStreams = useRef([]);
  const nonFeedSectionsStreams = useRef([]);
  const oldNonFeedSectionsStreams = useRef([]);
  const [newlyAddedStreams, setNewlyAddedStreams] = useState();
  // const [isInFocus, setIsInFocus] = useState();
  const isInFocus = useRef();
  const timer = useRef();
  const streamTags = useRef([]);
  const refreshAfterUnfollowTimer = useRef();
  const cancelToken = useRef(CancelToken.source());
  const [forceRerender] = useForceRerender();

  // eslint-disable-next-line no-unused-vars
  const [documentTitle, setDocumentTitle] = useDocumentTitle(
    newlyAddedStreams?.length ? `(${newlyAddedStreams?.length}) Feed` : 'Feed'
  );
  const windowFocusHandler = () => (isInFocus.current = true);
  const windowBlurHandler = () => !autoRefreshEnabled && setNewlyAddedStreams([]);
  useEventListenerMemo('focus', windowFocusHandler, document);
  useEventListenerMemo('blur', windowBlurHandler);

  const refresh = useCallback(
    async ({ firstLoad = false } = {}) => {
      cancelToken.current.cancel('New request incoming');
      cancelToken.current = CancelToken.source();
      setLoadingStates((c) => {
        return { ...c, refreshing: true, error: null };
      });
      try {
        if (isInFocus.current) setNewlyAddedStreams([]);
        isInFocus.current = false;

        const baseStreams = await pagination(
          await TwitchAPI.getFollowedStreams({
            user_id: twitchUserId,
            first: 100,
            cancelToken: cancelToken.current.token,
          }).catch((e) => {
            console.log('catch:', e);
            if (e.response.data.status) {
              addSystemNotification({
                title: 'Error fetching followed streams',
                body: `${e.response.data.status} - ${e.response.data.message}`,
              });
            }
            return e.response.data;
          })
        );
        console.log('baseStreams:', baseStreams);

        if (Array.isArray(baseStreams)) {
          const streamsWithProfiles = await addProfileInfo({
            items: baseStreams,
            save: true,
            refresh: firstLoad,
            cancelToken: cancelToken.current.token,
          });
          const streams = await addGameInfo({
            items: streamsWithProfiles,
            save: true,
            refresh: firstLoad,
            cancelToken: cancelToken.current.token,
          });
          const uniqueFilteredLiveStreams = uniqBy(streams, 'user_id');
          const streamsTag_ids = uniqueFilteredLiveStreams.reduce((acc, curr) => {
            return [...acc, ...(curr?.tag_ids || [])];
          }, []);
          const tag_ids = streamsTag_ids.filter(
            (tag) => !streamTags.current.find(({ tag_id } = {}) => tag_id === tag)
          );
          const uniqueTags = [...new Set(tag_ids)];

          const fetchedStreamTags = uniqueTags?.length
            ? await fetchAndAddTags({
                tag_ids: uniqueTags,
              })
            : [];
          const tags = uniqBy(
            [...(streamTags.current || []), ...(fetchedStreamTags || [])],
            'tag_id'
          );
          streamTags.current = tags;

          const recentLiveStreams = (uniqueFilteredLiveStreams || []).filter(
            (s = {}) => Math.trunc((Date.now() - new Date(s?.started_at).getTime()) / 1000) <= 150
          );

          oldLiveStreams.current = liveStreams.current;
          oldNonFeedSectionsStreams.current = nonFeedSectionsStreams.current;
          const uniqueStreams = uniqBy(
            [...(uniqueFilteredLiveStreams || []), ...(recentLiveStreams || [])],
            'id'
          );

          const streamsWithTags = uniqueStreams?.map((stream = {}) => {
            const streams_tags = stream?.tag_ids?.map((id) => {
              return tags?.find(({ tag_id } = {}) => tag_id === id);
            });
            const tag_names = streams_tags?.map((tag) => tag?.localization_names?.['en-us']);

            return { ...stream, tag_names, tags: streams_tags };
          });

          const enabledFeedSections =
            feedSections &&
            Object.values?.(feedSections)?.filter(
              (f = {}) => f.enabled && f.excludeFromTwitch_enabled
            );

          const orderedStreams = orderBy(streamsWithTags, (s) => s.viewer_count, 'desc');
          const nonFeedSectionLiveStreams = orderedStreams?.filter(
            (stream) =>
              !enabledFeedSections?.some(({ rules } = {}) => checkAgainstRules(stream, rules))
          );

          liveStreams.current = orderedStreams;

          setLiveStreamsState(orderedStreams);
          nonFeedSectionsStreams.current = nonFeedSectionLiveStreams;
          setLoadingStates({
            refreshing: false,
            error: null,
            loaded: true,
            lastLoaded: Date.now(),
          });
        } else {
          setLoadingStates({
            refreshing: false,
            error: baseStreams.status === 401 ? null : baseStreams.message,
            loaded: true,
            lastLoaded: Date.now(),
          });
        }
      } catch (error) {
        setLoadingStates({
          refreshing: false,
          error: error,
          loaded: true,
          lastLoaded: Date.now(),
        });
      }
    },
    [setNewlyAddedStreams, feedSections, twitchUserId]
  );

  useEffect(() => {
    if (liveStreams?.current?.length) {
      const enabledFeedSections =
        feedSections &&
        Object.values?.(feedSections)?.filter((f = {}) => f.enabled && f.excludeFromTwitch_enabled);

      nonFeedSectionsStreams.current = orderBy(
        liveStreams.current,
        (s) => s?.viewer_count,
        'desc'
      )?.filter(
        (stream) => !enabledFeedSections?.some(({ rules } = {}) => checkAgainstRules(stream, rules))
      );

      forceRerender();
    }
  }, [feedSections, forceRerender]);

  useEffect(() => {
    (async () => {
      try {
        const timeNow = new Date();
        if (!timer.current && validateToken) {
          if (autoRefreshEnabled) {
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
          }
          refresh({ firstLoad: true });
        }

        if (autoRefreshEnabled && !timer.current) {
          clearInterval(timer.current);
          timer.current = setInterval(() => {
            const timeNow = new Date();
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
            refresh();
          }, REFRESH_RATE * 1000);
        } else if (!autoRefreshEnabled && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
          setLoadingStates({ refreshing: false, loaded: true, error: null });
        }
      } catch (error) {
        setLoadingStates({ refreshing: false, error: error, loaded: true });
      }
    })();
  }, [refresh, autoRefreshEnabled, validateToken]);

  useEffect(() => {
    return () => {
      console.log('Handler Unmounting');
      clearInterval(timer.current);
    };
  }, []);

  if (!twitchAccessToken) {
    return (
      <Alert
        title='Not authenticated/connected with Twitch.'
        message='No access token for Twitch available.'
        fill
      />
    );
  }

  return (
    <>
      {loadingStates?.loaded &&
        timer.current &&
        validateToken &&
        (!!nonFeedSectionsStreams.current?.length || !!oldLiveStreams.current?.length) && (
          <>
            <LiveStreamsNotifications
              liveStreams={nonFeedSectionsStreams.current}
              oldLiveStreams={oldLiveStreams}
              setNewlyAddedStreams={setNewlyAddedStreams}
            />
            <OfflineStreamsNotifications
              liveStreams={liveStreamsState}
              nonFeedSectionLiveStreamsState={nonFeedSectionsStreams.current}
              oldLiveStreams={oldLiveStreams}
              oldNonFeedSectionsStreams={oldNonFeedSectionsStreams.current}
            />
            <UpdateStreamsNotifications
              liveStreams={nonFeedSectionsStreams.current}
              oldLiveStreams={oldLiveStreams}
            />
          </>
        )}
      {children({
        refreshing: loadingStates.refreshing,
        loaded: loadingStates.loaded,
        lastLoaded: loadingStates.lastLoaded,
        refreshTimer,
        // followedChannels: followedChannels.current,
        error: loadingStates.error,
        oldLiveStreams: oldLiveStreams.current || [],
        liveStreams: liveStreamsState || [],
        nonFeedSectionLiveStreams: nonFeedSectionsStreams.current || [],
        // liveStreams: liveStreams.current || [],
        // nonFeedSectionLiveStreams: nonFeedSectionLiveStreams.current || [],
        refresh,
        newlyAddedStreams,
        REFRESH_RATE,
        autoRefreshEnabled,
        refreshAfterUnfollowTimer,
      })}
    </>
  );
};
export default Handler;
