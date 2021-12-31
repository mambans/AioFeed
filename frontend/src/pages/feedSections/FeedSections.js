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
import { TwitchContext } from '../twitch/useToken';
import NotificationsContext from '../notifications/NotificationsContext';

const FeedSections = ({ data }) => {
  const { feedSections } = useContext(FeedSectionsContext);
  const { isEnabledFeedsectionNotifications } = useContext(TwitchContext);
  const { addNotification } = useContext(NotificationsContext);

  const checkAgainstRules = (stream, rules) => {
    return rules.some(
      (r) =>
        stream.title.toLowerCase().includes(r.title.toLowerCase()) &&
        stream.game_name.toLowerCase().includes(r.category.toLowerCase()) &&
        loginNameFormat(stream).includes(r.channel.toLowerCase()) &&
        stream.viewer_count >= r.viewers
    );
  };

  return (
    <TransitionGroup component={null}>
      {Object.values(feedSections)
        .reduce((acc, curr) => {
          const liveStreams = data?.liveStreams.filter((stream) =>
            checkAgainstRules(stream, curr.rules)
          );
          if (!curr.enabled || !liveStreams.length) return acc;
          return [...acc, { ...curr, data: { ...data, liveStreams } }];
        }, [])

        ?.map((feed, index) => (
          <CSSTransition timeout={1000} classNames='listHorizontalSlide' unmountOnExit appear>
            <Section
              key={feed.id}
              feed={feed}
              index={index}
              data={feed.data}
              isEnabledFeedsectionNotifications={isEnabledFeedsectionNotifications}
              addNotification={addNotification}
            />
          </CSSTransition>
        ))}
    </TransitionGroup>
  );
};

const Section = ({
  feed: { title, rules, id },
  data,
  index,
  isEnabledFeedsectionNotifications,
  addNotification,
}) => {
  const { orders, toggleExpanded } = useContext(FeedsContext);
  const previosStreams = useRef();

  useEffect(() => {
    console.log('previosStreams.current:', previosStreams.current);
    if (isEnabledFeedsectionNotifications && previosStreams?.current) {
      console.log('data?.liveStreams:', data?.liveStreams);
      const streamsToNotify = data?.liveStreams.filter(
        (stream) =>
          !previosStreams?.current?.find((s) => s.user_id === stream.user_id) &&
          data?.oldLiveStreams.find((s) => s.user_id === stream.user_id)
      );
      console.log('streamsToNotify:', streamsToNotify);

      console.log('data?.oldLiveStreams:', data?.oldLiveStreams);
      const streams = streamsToNotify?.map((stream = {}) => {
        stream.notiStatus = ` in ${title}}`;

        addSystemNotification({
          status: `in ${title}`,
          stream: stream,
          title: `${title}`,
          body: `${stream.title || stream.status || ''}\n${stream.game_name || stream.game || ''}`,
        });

        return stream;
      });

      console.log('streams:', streams);
      addNotification(streams);
    }
    previosStreams.current = data?.liveStreams || [];
  }, [
    data?.liveStreams,
    data?.oldLiveStreams,
    title,
    isEnabledFeedsectionNotifications,
    addNotification,
  ]);

  return (
    <Container order={orders?.[id]?.order} id={`FeedSection${title}Header`}>
      <Header
        id={title}
        title={
          <h5 onClick={() => toggleExpanded(id)}>
            {title}
            <HeaderNumberCount text={data?.liveStreams?.length} />
            <BsCollectionFill size={22} color={'#ff0060'} />
            <ExpandCollapseFeedButton collapsed={orders?.[id]?.collapsed} />
          </h5>
        }
        rightSide={<Rules rules={rules} name={title} id={id} />}
      />
      <ExpandableSection collapsed={orders?.[id]?.collapsed}>
        <TwitchStreams data={data} hideOnEmpty />
      </ExpandableSection>
    </Container>
  );
};
export default FeedSections;
