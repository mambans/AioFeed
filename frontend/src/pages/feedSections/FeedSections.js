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

const FeedSections = ({ data }) => {
  // console.log('FeedSections data:', data);
  const { feedSections } = useContext(FeedSectionsContext);
  const { addNotification } = useContext(NotificationsContext);

  const checkAgainstRules = (stream, rules) => {
    return rules.some(
      (r) =>
        stream.title.toLowerCase().includes(r.title.toLowerCase()) &&
        stream.game_name.toLowerCase().includes(r.category.toLowerCase()) &&
        loginNameFormat(stream).includes(r.channel.toLowerCase()) &&
        stream?.tag_names?.find((tag_name) =>
          tag_name?.toLowerCase()?.includes(r?.tag?.toLowerCase())
        ) &&
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
    // console.log('previosStreams?.current:', previosStreams?.current);
    try {
      if (notifications_enabled && previosStreams?.current) {
        const streamsToNotify = data?.liveStreams?.filter(
          (stream) =>
            !previosStreams?.current?.find((s) => s?.user_id === stream?.user_id) &&
            data?.oldLiveStreams?.find((s) => s?.user_id === stream?.user_id)
        );

        // console.log('streamsToNotify:', streamsToNotify);
        const streams = streamsToNotify?.map((stream = {}) => {
          stream.notiStatus = `in ${title}`;

          addSystemNotification({
            status: `in ${title}`,
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
  }, [data?.liveStreams, data?.oldLiveStreams, title, addNotification, notifications_enabled]);

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
