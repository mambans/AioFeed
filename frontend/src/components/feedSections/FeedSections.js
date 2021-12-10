import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header from '../sharedComponents/Header';
import { Container } from '../twitch/StyledComponents';
import FeedSectionsContext from './FeedSectionsContext';
import Rules from './Rules';
import TwitchStreams from './../twitch/live/Twitch';
import loginNameFormat from '../twitch/loginNameFormat';
import FeedsContext from '../feed/FeedsContext';
import { BsCollectionFill } from 'react-icons/bs';
import { ExpandCollapseFeedButton } from '../sharedComponents/sharedStyledComponents';
import ExpandableSection from '../sharedComponents/ExpandableSection';

const FeedSections = ({ data }) => {
  const { feedSections } = useContext(FeedSectionsContext);

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
            <Section key={feed.id} feed={feed} index={index} data={feed.data} />
          </CSSTransition>
        ))}
    </TransitionGroup>
  );
};

const Section = ({ feed: { title, rules, id }, data, index }) => {
  const { orders, toggleExpanded } = useContext(FeedsContext);

  return (
    <Container order={orders?.[id]?.order} id={`FeedSection${title}Header`}>
      <Header
        id={title}
        title={
          <h5 onClick={() => toggleExpanded(id)}>
            {title}
            <BsCollectionFill size={22} color={'#ff0060'} />
            <ExpandCollapseFeedButton collapsed={orders?.[id]?.collapsed} />
          </h5>
        }
        // refreshFunc={fetchMyListContextData}
        // isLoading={isLoading}
        // onHoverIconLink='nylists'

        rightSide={<Rules rules={rules} name={title} id={id} />}
      />
      <ExpandableSection collapsed={orders?.[id]?.collapsed}>
        <TwitchStreams data={data} hideOnEmpty />{' '}
      </ExpandableSection>
    </Container>
  );
};
export default FeedSections;
