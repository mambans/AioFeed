import { CSSTransition } from 'react-transition-group';
import React, { Suspense, useEffect, useRef } from 'react';

import { HideSidebarButton } from '../sidebar/StyledComponents';
import Handler from './Handler';
import Header from './Header';
import Sidebar from '../sidebar';
import TwitchStreams from './Twitch';
import { Container } from '../StyledComponents';
import ToolTip from '../../../components/tooltip/ToolTip';

import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import { askForBrowserNotificationPermission } from '../../../util';
import { MdFormatIndentDecrease } from 'react-icons/md';
import { BsCollectionFill } from 'react-icons/bs';
import Colors from '../../../components/themes/Colors';
import { useRecoilValue } from 'recoil';
import { nonFeedSectionStreamsAtom } from '../atoms';
import { feedPreferencesAtom, useFeedPreferences } from '../../../atoms/atoms';
// import FeedSections from '../../feedSections/FeedSections';
const FeedSections = React.lazy(() => import('../../feedSections/FeedSections'));

const TwitchFeed = ({ data, className, forceMount }) => {
  const { twitch, feedSections } = useRecoilValue(feedPreferencesAtom) || {};
  const nonFeedSectionLiveStreams = useRecoilValue(nonFeedSectionStreamsAtom);
  const feedPreferences = useRecoilValue(feedPreferencesAtom);
  const refreshBtnRef = useRef();
  const { toggleSidebar, toggleExpanded } = useFeedPreferences();

  return (
    <>
      <CSSTransition
        in={twitch?.enabled || forceMount}
        timeout={750}
        classNames='fade-750ms'
        appear
        unmountOnExit
      >
        <Container
          aria-labelledby='twitch'
          order={feedPreferences?.['twitch']?.order || 500}
          className={className}
        >
          <Header
            data={data}
            ref={refreshBtnRef}
            collapsed={feedPreferences?.['twitch']?.collapsed}
            toggleExpanded={() => toggleExpanded('twitch')}
            count={nonFeedSectionLiveStreams?.length}
          />
          <ExpandableSection collapsed={feedPreferences?.['twitch']?.collapsed}>
            <TwitchStreams data={data} streams={nonFeedSectionLiveStreams} />
          </ExpandableSection>
        </Container>
      </CSSTransition>
      <ToolTip
        placement={'right'}
        delay={{ show: 500, hide: 0 }}
        tooltip={`${twitch?.sidebar_enabled ? 'Hide' : 'Show'} sidebar`}
      >
        <HideSidebarButton
          show={String(twitch?.sidebar_enabled)}
          onClick={() => toggleSidebar('twitch')}
        >
          <MdFormatIndentDecrease size={25.5} />
        </HideSidebarButton>
      </ToolTip>
      <CSSTransition
        in={(twitch?.enabled || forceMount) && twitch?.sidebar_enabled}
        timeout={750}
        classNames='twitchSidebar'
        appear
        unmountOnExit
      >
        <Sidebar data={data} />
      </CSSTransition>
      <CSSTransition
        in={feedSections?.enabled}
        timeout={750}
        classNames='fade-750ms'
        unmountOnExit
        appear
      >
        <Suspense
          fallback={
            <h1>
              FeedSections..
              <BsCollectionFill size={22} color={Colors.raspberry} />
            </h1>
          }
        >
          <FeedSections data={data} />
        </Suspense>
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
