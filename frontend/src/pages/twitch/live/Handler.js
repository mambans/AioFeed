import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

import { TwitchContext } from '../useToken';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { fetchAndAddTags } from '../fetchAndAddTags';
import Alert from '../../../components/alert';
import addProfileInfo from '../functions/addProfileInfo';
import addGameInfo from '../functions/addGameInfo';
import LiveStreamsNotifications from './LiveStreamsNotifications';
import OfflineStreamsNotifications from './OfflineStreamsNotifications';
import UpdateStreamsNotifications from './UpdateStreamsNotifications';
import TwitchAPI, { pagination } from '../API';
import addSystemNotification from './addSystemNotification';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { baseLiveStreamsAtom, newBaseLiveStreamsAtom, previousBaseLiveStreamsAtom } from '../atoms';

const REFRESH_RATE = 25; // seconds

const Handler = ({ children }) => {
  const { autoRefreshEnabled, twitchAccessToken, twitchUserId } = useContext(TwitchContext);
  // const { feedSections } = useContext(FeedSectionsContext) || {};
  const [refreshTimer, setRefreshTimer] = useState(20);
  const setStreams = useSetRecoilState(baseLiveStreamsAtom);
  const setPreviousStreams = useSetRecoilState(previousBaseLiveStreamsAtom);
  const newBaseLiveStreams = useRecoilValue(newBaseLiveStreamsAtom);

  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
    lastLoaded: false,
    rnd: Math.random(),
  });
  const liveStreams = useRef();
  // const [isInFocus, setIsInFocus] = useState();
  const timer = useRef();
  const streamTags = useRef([]);
  const refreshAfterUnfollowTimer = useRef();
  const controller = useRef(new AbortController());

  // eslint-disable-next-line no-unused-vars
  const [documentTitle, setDocumentTitle] = useDocumentTitle(
    newBaseLiveStreams?.length ? `(${newBaseLiveStreams?.length}) Feed` : 'Feed'
  );

  const refresh = useCallback(
    async ({ firstLoad = false } = {}) => {
      console.log('refresh:');
      controller.current.abort();
      setLoadingStates((c) => {
        return { ...c, refreshing: true, error: null };
      });
      try {
        const baseStreams = await pagination(
          await TwitchAPI.getFollowedStreams({
            user_id: twitchUserId,
            first: 100,
            signal: controller.current?.signal,
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

        if (Array.isArray(baseStreams)) {
          const streamsWithProfiles = await addProfileInfo({
            items: baseStreams,
            save: true,
            refresh: firstLoad,
            signal: controller.current?.signal,
          });
          const streams = await addGameInfo({
            items: streamsWithProfiles,
            save: true,
            refresh: firstLoad,
            signal: controller.current?.signal,
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

          setPreviousStreams(liveStreams.current);
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

          const orderedStreams = orderBy(streamsWithTags, (s) => s.viewer_count, 'desc');
          liveStreams.current = orderedStreams;

          setStreams(orderedStreams);
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
    [twitchUserId, setStreams, setPreviousStreams]
  );

  useEffect(() => {
    (async () => {
      try {
        const timeNow = new Date();
        if (!timer.current) {
          if (autoRefreshEnabled) {
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
          }
          refresh({ firstLoad: true });
        }

        if (autoRefreshEnabled && !timer.current) {
          clearInterval(timer.current);
          timer.current = null;
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
  }, [refresh, autoRefreshEnabled]);

  useEffect(() => {
    return () => {
      console.log('Handler Unmounting');
      clearInterval(timer.current);
      timer.current = null;
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
      {loadingStates?.loaded && (
        // (!!nonFeedSectionsStreams.current?.length || !!oldLiveStreams.current?.length) && (
        <>
          <LiveStreamsNotifications />
          <OfflineStreamsNotifications />
          <UpdateStreamsNotifications />
        </>
      )}
      {children({
        refreshing: loadingStates.refreshing,
        loaded: loadingStates.loaded,
        lastLoaded: loadingStates.lastLoaded,
        refreshTimer,
        error: loadingStates.error,
        refresh,
        REFRESH_RATE,
        autoRefreshEnabled,
        refreshAfterUnfollowTimer,
      })}
    </>
  );
};
export default Handler;
