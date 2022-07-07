import React, { useContext, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header, { HeaderNumberCount } from '../../components/Header';
import { Container } from '../twitch/StyledComponents';
import FeedSectionsContext from './FeedSectionsContext';
import Rules from './Rules';
import TwitchStreams from './../twitch/live/Twitch';
import loginNameFormat from '../twitch/loginNameFormat';
import FeedsContext from '../feed/FeedsContext';
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

export const checkAgainstRules = (stream, rules) => {
  if (!rules) return stream;
  return rules?.some((r) => {
    const title = stream.title?.toLowerCase().includes(r.title?.toLowerCase()?.trim());
    const game = stream.game_name?.toLowerCase().includes(r.category?.toLowerCase()?.trim());
    const name = loginNameFormat(stream)
      ?.toLowerCase()
      ?.trim()
      .includes(r.channel?.toLowerCase()?.trim());
    const tags = stream?.tag_names
      ? stream?.tag_names?.find((tag_name) =>
          tag_name?.toLowerCase()?.includes(r?.tag?.toLowerCase()?.trim())
        )
      : true;
    const viewer_count = stream.viewer_count >= r.viewers;

    return title && game && name && tags && viewer_count;
  });
};

const FeedSections = ({ data }) => {
  // console.log('FeedSections data:', data);
  const { feedSections } = useContext(FeedSectionsContext);
  const { addNotification } = useContext(NotificationsContext);

  return (
    <TransitionGroup component={null}>
      {Object.values(feedSections)
        .reduce((acc, curr) => {
          const liveStreams = data?.liveStreams.filter((stream) =>
            checkAgainstRules(stream, curr.rules)
          );
          if (!curr.enabled) return acc;
          return [...acc, { ...curr, data: { ...data, liveStreams, streams: data?.liveStreams } }];
        }, [])
        ?.map((feed, index) => (
          <CSSTransition
            key={feed.id}
            timeout={1000}
            classNames='listHorizontalSlide'
            unmountOnExit
            appear
          >
            <Section
              key={feed.id}
              feed={feed}
              index={index}
              data={feed.data}
              addNotification={addNotification}
            />
          </CSSTransition>
        ))}
    </TransitionGroup>
  );
};

const Section = ({
  feed: { title, rules, id, notifications_enabled },
  data,
  index,
  addNotification,
}) => {
  const { orders, toggleExpanded } = useContext(FeedsContext);
  const previosStreams = useRef();
  const timer = useRef();
  const { isEnabledUpdateNotifications, updateNotischannels } = useContext(TwitchContext);
  const { fetchLatestVod } = useFetchSingelVod();

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

          const streams = streamsToNotifyLive?.map((stream = {}) => {
            const wentLive = !data?.oldLiveStreams?.find((s) => s?.user_id === stream?.user_id);
            const notisTitle = `${loginNameFormat(stream)} ${wentLive ? 'Live ' : ''}in ${title}`;
            stream.notiStatus = notisTitle;

            addSystemNotification({
              title: notisTitle,
              icon: stream?.profile_image_url,
              body: `${stream.title || stream.status || ''}\n${
                stream.game_name || stream.game || ''
              }`,
              onClick: (e) => {
                e.preventDefault();
                const url = `https://aiofeed.com/${(
                  stream.login ||
                  stream.user_login ||
                  stream.user_name ||
                  stream.name ||
                  stream.display_name ||
                  stream.broadcaster_name
                )?.toLowerCase()}`;
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

          const leftStreams = streamsToNotifyLeftSection?.map((stream = {}) => {
            const wentOffline = !data?.streams.find((s) => s.user_id === stream?.user_id);
            const notisTitle = wentOffline
              ? `${loginNameFormat(stream)} went offline from ${title}`
              : `${loginNameFormat(stream)} left ${title}`;
            stream.notiStatus = notisTitle;

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
                const url = `https://aiofeed.com/${(
                  stream.login ||
                  stream.user_login ||
                  stream.user_name ||
                  stream.name ||
                  stream.display_name ||
                  stream.broadcaster_name
                )?.toLowerCase()}`;
                window.open(url, '_blank');
              },
            });

            if (wentOffline) {
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
    data?.oldLiveStreams,
    title,
    addNotification,
    notifications_enabled,
    data?.loaded,
    isEnabledUpdateNotifications,
    updateNotischannels,
    data?.streams,
    fetchLatestVod,
  ]);

  if (!data?.liveStreams?.length) return null;
  return (
    <Container
      aria-labelledby={`FeedSection-${id}`}
      order={orders?.[id]?.order}
      key={`FeedSection-${id}`}
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
            <ExpandCollapseFeedButton collapsed={orders?.[id]?.collapsed} />
          </h1>
        }
        rightSide={<Rules rules={rules} name={title} id={id} />}
      />
      <ExpandableSection collapsed={orders?.[id]?.collapsed}>
        <TwitchStreams data={data} streams={data.liveStreams} hideOnEmpty />
      </ExpandableSection>
    </Container>
  );
};
export default FeedSections;
