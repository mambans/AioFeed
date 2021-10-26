import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header from '../sharedComponents/Header';
import { Container } from '../twitch/StyledComponents';
import FeedSectionsContext from './FeedSectionsContext';
import Rules from './Rules';
import TwitchStreams from './../twitch/live/Twitch';
import loginNameFormat from '../twitch/loginNameFormat';
import FeedsContext from '../feed/FeedsContext';

const FeedSections = ({ data }) => {
  const { feedSections } = useContext(FeedSectionsContext);

  return (
    <TransitionGroup component={null}>
      {Object.values(feedSections)?.map((feed, index) => (
        <Section key={feed.name} feed={feed} index={index} data={data} />
      ))}
    </TransitionGroup>
  );
};

const Section = ({ feed: { name, enabled, rules }, data, index }) => {
  const { orders } = useContext(FeedsContext);
  const checkAgainstRules = (stream) => {
    return rules.some(
      (r) =>
        stream.title.toLowerCase().includes(r.title.toLowerCase()) &&
        stream.game_name.toLowerCase().includes(r.category.toLowerCase()) &&
        loginNameFormat(stream).includes(r.channel.toLowerCase()) &&
        stream.viewer_count >= r.viewers
    );
  };

  const filterdData = {
    ...data,
    liveStreams: data.liveStreams.filter(checkAgainstRules),
  };

  if (!enabled) return null;
  return (
    <CSSTransition
      in={!!filterdData.liveStreams.length}
      timeout={1000}
      classNames='listHorizontalSlide'
      unmountOnExit
      appear
    >
      <Container order={orders[name]} id={`FeedSection${name}Header`}>
        <Header
          id={name}
          text={<>{name}</>}
          // refreshFunc={fetchAllLists}
          // isLoading={isLoading}
          // onHoverIconLink='nylists'
          rightSide={<Rules rules={rules} name={name} />}
          feedName={name}
        />
        <TwitchStreams data={filterdData} hideOnEmpty />
      </Container>
    </CSSTransition>
  );
};
export default FeedSections;
