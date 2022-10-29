import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SidebarItem from './SidebarItem';
import { Styledsidebar, SidebarHeader, StyledSidebarSection } from './StyledComponents';
import LoadingSidebar from './LoadingSidebar';
import { TwitchContext } from '../useToken';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import { checkAgainstRules } from '../../feedSections/FeedSections';
import { ExpandCollapseFeedButton } from '../../sharedComponents/sharedStyledComponents';
import { useRecoilValue } from 'recoil';
import { baseLiveStreamsAtom, feedSectionsAtom, nonFeedSectionStreamsAtom } from '../atoms';
import { feedPreferencesAtom, useFeedPreferences } from '../../../atoms/atoms';

const Sidebar = ({ data, streams }) => {
  const { loaded } = data;
  const feedSections = useRecoilValue(feedSectionsAtom);
  const feedPreferences = useRecoilValue(feedPreferencesAtom) || {};

  const liveStreams = useRecoilValue(baseLiveStreamsAtom);
  const nonFeedSectionsLiveStreams = useRecoilValue(nonFeedSectionStreamsAtom);

  if (loaded) {
    return (
      <Styledsidebar id='twitchSidebar'>
        <SidebarSection
          key={'twitch-sidebar-key'}
          feed={{ title: 'Twitch Live', id: 'twitch' }}
          items={nonFeedSectionsLiveStreams}
        />

        {feedPreferences?.feedSections?.enabled &&
          feedSections &&
          Object.values(feedSections)
            .reduce((acc, feedsection) => {
              const streams = liveStreams.filter((stream) =>
                checkAgainstRules(stream, feedsection.rules)
              );
              if (!feedsection.enabled || !feedsection.sidebar_enabled) return acc;
              return [...acc, { ...feedsection, items: streams }];
            }, [])
            ?.map((feed, index) => (
              <SidebarSection key={feed.id} feed={feed} index={index} items={feed.items} />
            ))}
      </Styledsidebar>
    );
  }
  return <LoadingSidebar />;
};
export default Sidebar;

const SidebarSection = ({ feed: { title, id }, items }) => {
  const { favStreams } = useContext(TwitchContext);
  const { toggleSidebarExpanded } = useFeedPreferences();
  const feedPreferences = useRecoilValue(feedPreferencesAtom);

  const [shows, setShows] = useState();
  const resetShowsTimer = useRef();

  const { favoriteStreams, nonFavoriteStreams } = items?.reduce(
    (acc, stream) => {
      if (favStreams?.includes?.(stream?.user_id)) {
        return { ...acc, favoriteStreams: [...acc.favoriteStreams, stream] };
      }
      return { ...acc, nonFavoriteStreams: [...acc.nonFavoriteStreams, stream] };
    },
    { favoriteStreams: [], nonFavoriteStreams: [] }
  );

  const sidebarItemAttrs = {
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

  if (id !== 'twitch' && !items?.length) return null;

  return (
    <StyledSidebarSection
      aria-labelledby={`SidebarSection-${id}`}
      order={feedPreferences?.[id]?.order || 500}
    >
      <SidebarHeader id={`SidebarSection-${id}`} onClick={handleCollapse}>
        {title} <ExpandCollapseFeedButton collapsed={feedPreferences?.[id]?.sidebar_collapsed} />
      </SidebarHeader>
      <ExpandableSection collapsed={feedPreferences?.[id]?.sidebar_collapsed}>
        {items?.length ? (
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
