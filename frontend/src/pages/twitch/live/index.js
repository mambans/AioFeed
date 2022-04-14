import { CSSTransition } from 'react-transition-group';
import React, { useContext, useEffect, useRef } from 'react';

import { HideSidebarButton } from '../sidebar/StyledComponents';
import FeedsContext from '../../feed/FeedsContext';
import Handler from './Handler';
import Header from './Header';
import Sidebar from '../sidebar';
import TwitchStreams from './Twitch';
import FeedsCenterContainer from '../../feed/FeedsCenterContainer';
import { Container } from '../StyledComponents';
import ToolTip from '../../../components/tooltip/ToolTip';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import FeedSections from '../../feedSections/FeedSections';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import { askForBrowserNotificationPermission } from '../../../util';
import { MdFormatIndentDecrease } from 'react-icons/md';

export const TwitchStandalone = () => {
  useDocumentTitle('Twitch Live');
  return (
    <FeedsCenterContainer left={true} right={false}>
      <div className='feed'>
        <Twitch in={true} className='feed' />
      </div>
    </FeedsCenterContainer>
  );
};

const TwitchFeed = ({ data, className, forceMount }) => {
  const {
    enableTwitch,
    showTwitchSidebar,
    setShowTwitchSidebar,
    enableFeedSections,
    orders,
    toggleExpanded,
  } = useContext(FeedsContext) || {};
  const refreshBtnRef = useRef();

  return (
    <>
      <CSSTransition
        in={enableTwitch || forceMount}
        timeout={750}
        classNames='fade-750ms'
        appear
        unmountOnExit
      >
        <Container aria-labelledby='twitch' order={orders?.['twitch']?.order} className={className}>
          <Header
            data={data}
            ref={refreshBtnRef}
            collapsed={orders?.['twitch']?.collapsed}
            toggleExpanded={() => toggleExpanded('twitch')}
          />
          <ExpandableSection collapsed={orders?.['twitch']?.collapsed}>
            <TwitchStreams data={data} streams={data.nonFeedSectionLiveStreams} />
          </ExpandableSection>
        </Container>
      </CSSTransition>
      <ToolTip
        placement={'right'}
        delay={{ show: 500, hide: 0 }}
        tooltip={`${showTwitchSidebar ? 'Hide' : 'Show'} sidebar`}
      >
        <HideSidebarButton
          show={String(showTwitchSidebar)}
          onClick={() => setShowTwitchSidebar(!showTwitchSidebar)}
        >
          <MdFormatIndentDecrease size={25.5} />
        </HideSidebarButton>
      </ToolTip>
      <CSSTransition
        in={(enableTwitch || forceMount) && showTwitchSidebar}
        timeout={750}
        classNames='twitchSidebar'
        appear
        unmountOnExit
      >
        <Sidebar data={data} />
      </CSSTransition>
      <CSSTransition
        in={enableFeedSections}
        timeout={750}
        classNames='fade-750ms'
        unmountOnExit
        appear
      >
        <FeedSections data={data} />
      </CSSTransition>
    </>
  );
};

export const Twitch = ({ in: forceMount = false, className }) => {
  useEffect(() => {
    askForBrowserNotificationPermission();
  }, []);

  return (
    <Handler>
      {(data) => {
        return <TwitchFeed forceMount={forceMount} className={className} data={data} />;
      }}
    </Handler>
  );
};

// react.memo not doing much atm
export default React.memo(Twitch);
