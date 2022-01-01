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
import { CustomFilterProvider } from '../CustomFilters/CustomFilterContext';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import FeedSections from '../../feedSections/FeedSections';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import { askForBrowserNotificationPermission } from '../../../util';

const TwitchStandalone = () => {
  useDocumentTitle('Twitch Live');
  return (
    <FeedsCenterContainer left={true} right={false}>
      <Twitch in={true} className='feed' />
    </FeedsCenterContainer>
  );
};

export const Twitch = ({ in: forceMount = false, className }) => {
  const { enableTwitch, showTwitchSidebar, setShowTwitchSidebar, enableFeedSections } =
    useContext(FeedsContext) || {};

  const { orders, toggleExpanded } = useContext(FeedsContext);
  const refreshBtnRef = useRef();

  useEffect(() => {
    askForBrowserNotificationPermission();
  }, []);

  return (
    <CustomFilterProvider>
      <Handler>
        {(data) => (
          <>
            <CSSTransition
              in={enableTwitch || forceMount}
              timeout={750}
              classNames='fade-750ms'
              appear
              unmountOnExit
            >
              <Container order={orders?.['twitch']?.order} className={className}>
                <Header
                  data={data}
                  ref={refreshBtnRef}
                  collapsed={orders?.['twitch']?.collapsed}
                  toggleExpanded={() => toggleExpanded('twitch')}
                />
                <ExpandableSection collapsed={orders?.['twitch']?.collapsed}>
                  <TwitchStreams data={data} />
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
              />
            </ToolTip>
            <CSSTransition
              in={(enableTwitch || forceMount) && showTwitchSidebar}
              timeout={750}
              classNames='twitchSidebar'
              appear
              unmountOnExit
            >
              <Sidebar
                loaded={data.loaded}
                onlineStreams={data.liveStreams}
                newlyAdded={data.newlyAddedStreams}
              />
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
        )}
      </Handler>
    </CustomFilterProvider>
  );
};
export default TwitchStandalone;
