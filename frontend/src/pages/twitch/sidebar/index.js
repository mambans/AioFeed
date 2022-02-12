import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SidebarItem from './SidebarItem';
import { Styledsidebar, SidebarHeader, StyledSidebarSection } from './StyledComponents';
import LoadingSidebar from './LoadingSidebar';
import { TwitchContext } from '../useToken';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import FeedSectionsContext from '../../feedSections/FeedSectionsContext';
import { checkAgainstRules } from '../../feedSections/FeedSections';
import FeedsContext from '../../feed/FeedsContext';
import { ExpandCollapseFeedButton } from '../../sharedComponents/sharedStyledComponents';

const Sidebar = ({ data }) => {
  const { loaded, nonFeedSectionLiveStreams } = data;
  const { feedSections } = useContext(FeedSectionsContext);

  if (loaded) {
    return (
      <Styledsidebar id='twitchSidebar'>
        <SidebarSection
          key={'twitch-sidebar-key'}
          feed={{ title: 'Twitch Live', id: 'twitch' }}
          data={{ streams: nonFeedSectionLiveStreams }}
        />

        {Object.values(feedSections)
          .reduce((acc, curr) => {
            const liveStreams = data?.liveStreams.filter((stream) =>
              checkAgainstRules(stream, curr.rules)
            );
            if (!curr.enabled) return acc;
            return [...acc, { ...curr, data: { ...data, liveStreams } }];
          }, [])
          ?.map((feed, index) => (
            <SidebarSection key={feed.id} feed={feed} index={index} data={feed.data} />
          ))}
      </Styledsidebar>
    );
  }
  return <LoadingSidebar />;
};
export default Sidebar;

const SidebarSection = ({ feed: { title, id }, data, index }) => {
  const { favStreams } = useContext(TwitchContext);
  const { orders, toggleSidebarExpanded } = useContext(FeedsContext);
  const { streams, newlyAdded } = data;
  const [shows, setShows] = useState();
  const resetShowsTimer = useRef();

  const favoriteStreams = streams?.filter((c) => favStreams?.includes(c.user_name?.toLowerCase()));
  const nonFavoriteStreams = streams?.filter(
    (c) => !favStreams?.includes(c.user_name?.toLowerCase())
  );

  const sidebarItemAttrs = {
    newlyAdded: newlyAdded,
    shows: shows,
    setShows: setShows,
    resetShowsTimer: resetShowsTimer,
  };
  const cssTransitionAttrs = {
    timeout: 1000,
    classNames: 'sidebarVideoFade-1s',
    unmountOnExit: true,
  };

  const handleCollapse = () => toggleSidebarExpanded(id);

  if (id !== 'twitch' && !streams?.length) return null;

  return (
    <StyledSidebarSection order={orders?.[id]?.order}>
      <SidebarHeader onClick={handleCollapse}>
        {title} <ExpandCollapseFeedButton collapsed={orders?.[id]?.sidebar_collapsed} />
      </SidebarHeader>
      <ExpandableSection collapsed={orders?.[id]?.sidebar_collapsed}>
        {streams?.length ? (
          <>
            <TransitionGroup className='sidebar' component={null}>
              {favoriteStreams.map((stream) => (
                <CSSTransition key={stream.user_id} {...cssTransitionAttrs}>
                  <SidebarItem
                    key={stream.user_id}
                    stream={stream}
                    favorited={true}
                    {...sidebarItemAttrs}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
            <TransitionGroup className='sidebar' component={null}>
              {nonFavoriteStreams.map((stream) => (
                <CSSTransition key={stream.user_id} {...cssTransitionAttrs}>
                  <SidebarItem key={stream.user_id} stream={stream} {...sidebarItemAttrs} />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </>
        ) : (
          <div
            style={{
              height: '62px',
              padding: '8px 5px 8px 10px',
              fontSize: '1rem',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            <p>None Live</p>
          </div>
        )}
      </ExpandableSection>
    </StyledSidebarSection>
  );
};
