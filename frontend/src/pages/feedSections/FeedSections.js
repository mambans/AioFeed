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

export const checkAgainstRules = (stream, rules) => {
  return rules.some(
    (r) =>
      stream.title?.toLowerCase().includes(r.title?.toLowerCase()?.trim()) &&
      stream.game_name?.toLowerCase().includes(r.category?.toLowerCase()?.trim()) &&
      loginNameFormat(stream)?.toLowerCase()?.trim().includes(r.channel?.toLowerCase()?.trim()) &&
      stream?.tag_names?.find((tag_name) =>
        tag_name?.toLowerCase()?.includes(r?.tag?.toLowerCase()?.trim())
      ) &&
      stream.viewer_count >= r.viewers
  );
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
          return [...acc, { ...curr, data: { ...data, liveStreams } }];
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

  useEffect(() => {
    try {
      if (notifications_enabled && previosStreams?.current && data?.loaded) {
        const streamsToNotify = data?.liveStreams?.filter(
          (stream) => !previosStreams?.current?.find((s) => s?.user_id === stream?.user_id)
        );

        const streams = streamsToNotify?.map((stream = {}) => {
          const notisTitle = `${
            !data?.oldLiveStreams?.find((s) => s?.user_id === stream?.user_id) ? 'Live ' : ''
          }in ${title}`;
          stream.notiStatus = notisTitle;

          addSystemNotification({
            status: notisTitle,
            stream: stream,
            title: `${title}`,
            body: `${stream.title || stream.status || ''}\n${
              stream.game_name || stream.game || ''
            }`,
          });

          return stream;
        });

        addNotification(streams);
      }
    } catch (e) {
      console.log('Section useeffect Error', e);
    }
    previosStreams.current = data?.liveStreams || [];
  }, [
    data?.liveStreams,
    data?.oldLiveStreams,
    title,
    addNotification,
    notifications_enabled,
    data?.loaded,
  ]);

  if (!data?.liveStreams?.length) return null;
  return (
    <Container
      aria-labelledby={`FeedSection-${id}`}
      order={orders?.[id]?.order}
      key={`FeedSection-${id}`}
    >
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
