import React, { useContext, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header, { HeaderNumberCount } from '../../components/Header';
import { Container } from '../twitch/StyledComponents';
import TwitchStreams from './../twitch/live/Twitch';
import loginNameFormat from '../twitch/loginNameFormat';
import { BsCollectionFill } from 'react-icons/bs';
import { ExpandCollapseFeedButton } from '../sharedComponents/sharedStyledComponents';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import addSystemNotification from '../twitch/live/addSystemNotification';
import NotificationsContext from '../notifications/NotificationsContext';
import Colors from '../../components/themes/Colors';
import { TwitchContext } from '../twitch/useToken';
import UpdateStreamsNotifications from '../twitch/live/UpdateStreamsNotifications';
import { durationMsToDate } from '../twitch/TwitchUtils';
import moment from 'moment';
import useFetchSingelVod from '../twitch/vods/hooks/useFetchSingelVod';
import { useRecoilValue } from 'recoil';
import {
  baseLiveStreamsAtom,
  feedSectionsAtom,
  previousBaseLiveStreamsAtom,
} from '../twitch/atoms';
import { vodChannelsAtom } from '../twitch/vods/atoms';
import { feedPreferencesAtom, useFeedPreferences } from '../../atoms/atoms';
import FeedSectionSettings from './FeedSectionSettings';

export const checkAgainstRules = (stream, rules) => {
  if (!rules) return stream;
  return rules?.some((r) => {
    const title = stream.title?.toLowerCase().includes(r.title?.toLowerCase()?.trim());
    //game is not included in vods, so cant filter vods based on game
    //but if i have !stream.game_name, then rules with only a game will return true
    //ex. If i only have ASMR a game then vods with no game would return true and all vods will be shows..
    const game =
      // (!stream.game_name && title) ||
      stream.game_name?.toLowerCase().includes(r.category?.toLowerCase()?.trim());
    const name = loginNameFormat(stream)
      ?.toLowerCase()
      ?.trim()
      .includes(r.channel?.toLowerCase()?.trim());
    const tags =
      !stream?.tag_names ||
      stream?.tag_names?.find((tag_name) =>
        tag_name?.toLowerCase()?.includes(r?.tag?.toLowerCase()?.trim())
      );

    const viewer_count = stream.viewer_count >= r.viewers || stream.view_count >= r.viewers;

    return title && game && name && tags && viewer_count;
  });
};

const FeedSections = ({ data }) => {
  // console.log('FeedSections data:', data);
  // const { feedSections } = useContext(FeedSectionsContext);
  const feedSections = useRecoilValue(feedSectionsAtom);
  const { addNotification } = useContext(NotificationsContext);
  const streams = useRecoilValue(baseLiveStreamsAtom);
  // const twitchVods = useRecoilValue(twitchVodsAtom);

  return (
    <TransitionGroup component={null}>
      {Object.values(feedSections)
        .reduce((acc, feedSection) => {
          if (!feedSection.enabled) return acc;

          // const vods =
          //   // ((feedSection.include_vods || true) &&
          //   twitchVods?.data?.filter(
          //     (vod) => checkAgainstRules(vod, feedSection.rules)
          //   ) || [];

          const liveStreams = streams?.filter((stream) =>
            checkAgainstRules(stream, feedSection.rules)
          );
          return [...acc, { ...feedSection, data: { ...data, liveStreams, streams } }];
        }, [])
        ?.map((section, index) => (
          <CSSTransition
            key={section.id}
            timeout={1000}
            classNames='listHorizontalSlide'
            unmountOnExit
            appear
          >
            <Section
              key={section.id}
              section={section}
              index={index}
              data={section.data}
              addNotification={addNotification}
            />
          </CSSTransition>
        ))}
    </TransitionGroup>
  );
};

const Section = ({ section, data, index, addNotification }) => {
  const { title, id, notifications_enabled } = section;
  const { toggleExpanded } = useFeedPreferences();
  const feedPreferences = useRecoilValue(feedPreferencesAtom);

  const previosStreams = useRef();
  const timer = useRef();
  const { isEnabledUpdateNotifications, updateNotischannels } = useContext(TwitchContext);
  const { fetchLatestVod } = useFetchSingelVod();
  const channels = useRecoilValue(vodChannelsAtom);
  const previousStreams = useRecoilValue(previousBaseLiveStreamsAtom);

  useEffect(() => {
    (async () => {
      try {
        if (previosStreams?.current && data?.loaded) {
          const streamsToNotifyLive = notifications_enabled
            ? data?.liveStreams?.filter(
                (stream) => !previosStreams?.current?.find((s) => s?.user_id === stream?.user_id)
              )
            : [];
          const streamsToNotifyLeftSection = previosStreams?.current?.filter(
            (stream) => !data?.liveStreams?.find((s) => s?.user_id === stream?.user_id)
          );

          const streams = streamsToNotifyLive?.map((s = {}) => {
            const wentLive = !previousStreams?.find((st) => s?.user_id === st?.user_id);
            const notisTitle = `${loginNameFormat(s)} ${wentLive ? 'Live ' : ''}in ${title}`;
            const stream = { ...s, notiStatus: notisTitle };

            addSystemNotification({
              title: notisTitle,
              icon: stream?.profile_image_url,
              body: `${stream.title || stream.status || ''}\n${
                stream.game_name || stream.game || ''
              }`,
              onClick: (e) => {
                e.preventDefault();
                const url = `https://aiofeed.com/${loginNameFormat(stream, true)?.toLowerCase()}`;
                window.open(url, '_blank');
              },
            });

            if (fetchLatestVod && wentLive) {
              timer.current = setTimeout(
                () => fetchLatestVod({ user_id: stream.user_id, check: true }),
                30000
              );
            }

            return stream;
          });

          const leftStreams = streamsToNotifyLeftSection?.map((s = {}) => {
            const wentOffline = !data?.streams.find((s) => s.user_id === s?.user_id);
            const notisTitle = wentOffline
              ? `${loginNameFormat(s)} went offline from ${title}`
              : `${loginNameFormat(s)} left ${title}`;
            const stream = { ...s, notiStatus: notisTitle };

            addSystemNotification({
              title: notisTitle,
              icon: stream?.profile_image_url,
              body: wentOffline
                ? `Was live for ${durationMsToDate(moment().diff(moment(stream.started_at)))}`
                : `${stream.title || stream.status || ''}\n${
                    stream.game_name || stream.game || ''
                  }`,
              onClick: (e) => {
                e.preventDefault();
                const url = `https://aiofeed.com/${loginNameFormat(
                  stream,
                  true
                )?.toLowerCase()}/page`;
                window.open(url, '_blank');
              },
            });

            if (wentOffline && channels?.includes(String(stream.user_id))) {
              fetchLatestVod({ user_id: stream.user_id, check: true });
            }

            return stream;
          });

          addNotification([...streams, ...leftStreams]);
        }
      } catch (e) {
        console.log('Section useeffect Error', e);
      }
    })();

    if (data?.loaded) previosStreams.current = data?.liveStreams || [];

    return () => {
      clearTimeout(timer.current);
    };
  }, [
    data?.liveStreams,
    previousStreams,
    title,
    addNotification,
    notifications_enabled,
    data?.loaded,
    isEnabledUpdateNotifications,
    updateNotischannels,
    data?.streams,
    fetchLatestVod,
    channels,
  ]);

  if (!data?.liveStreams?.length) return null;

  return (
    <Container
      aria-labelledby={`FeedSection-${id}`}
      order={feedPreferences?.[id]?.order || 500}
      key={`FeedSection-${id}`}
      id={`FeedSection-${id}`}
    >
      <UpdateStreamsNotifications liveStreams={data?.liveStreams} oldLiveStreams={previosStreams} />
      <Header
        {...data}
        isLoading={data.refreshing}
        id={title}
        title={
          <h1 id={`FeedSection-${id}`} onClick={() => toggleExpanded(id)}>
            {title}
            <HeaderNumberCount text={data?.liveStreams?.length} />
            <BsCollectionFill size={22} color={Colors.raspberry} />
            <ExpandCollapseFeedButton collapsed={feedPreferences?.[id]?.collapsed} />
          </h1>
        }
        rightSide={<FeedSectionSettings section={section} width={290} />}
      />
      <ExpandableSection collapsed={feedPreferences?.[id]?.collapsed}>
        <TwitchStreams data={data} streams={data.liveStreams} hideOnEmpty />
        {/* <Container>
          {data.vods?.slice(0, videoElementsAmount).map((vod) => (
            <CSSTransition
              in={true}
              key={vod.id}
              timeout={750}
              classNames={'fade-750ms'}
              unmountOnExit
            >
              <VodElement data={vod} />
            </CSSTransition>
          ))}
        </Container> */}
      </ExpandableSection>
    </Container>
  );
};
export default FeedSections;
