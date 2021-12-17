import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Alert } from 'react-bootstrap';
import React, { useState, useMemo, useContext } from 'react';
import { debounce } from 'lodash';

import LoadMore from '../../../components/loadMore/LoadMore';
import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import { SubFeedHeader } from './StyledComponents';
import ClipsSortButton from './ClipsSortButton';
import SortButton from './SortButton';
import ClipElement from './ClipElement';
import VodElement from '../vods/VodElement';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import FeedsContext from '../../feed/FeedsContext';

const SubFeed = ({
  feedName,
  items,
  sortBy,
  setSortBy,
  setSortData,
  fetchItems,
  itemPagination,
  channelInfo,
}) => {
  const { feedVideoSizeProps } = useContext(FeedsContext) || {};
  const [numberOfVideos, setNumberOfVideos] = useState(
    Math.floor(window.innerWidth / (feedVideoSizeProps?.totalWidth || 350))
  );

  const recalcWidth = useMemo(
    () =>
      debounce(
        () =>
          setNumberOfVideos(
            Math.floor(window.innerWidth / (feedVideoSizeProps?.totalWidth || 350))
          ),
        20,
        {
          leading: true,
          trailing: false,
        }
      ),
    [feedVideoSizeProps]
  );

  useEventListenerMemo('resize', recalcWidth);

  return (
    <>
      <SubFeedHeader
        style={{
          width: `${numberOfVideos * (feedVideoSizeProps?.totalWidth || 350)}px`,
        }}
      >
        {feedName?.toLowerCase() === 'vods' ? (
          <SortButton sortBy={sortBy} setSortBy={setSortBy} setData={setSortData} />
        ) : (
          <ClipsSortButton sortBy={sortBy} setSortBy={setSortBy} setData={setSortData} />
        )}
        <h3>{feedName}</h3>
      </SubFeedHeader>

      {items && Array.isArray(items) ? (
        <TransitionGroup
          className='videos'
          style={{
            minHeight: feedName === 'Vods' ? '310px' : '310px',
            paddingBottom: '0',
            width: `${numberOfVideos * (feedVideoSizeProps?.totalWidth || 350)}px`,
            margin: 'auto',
          }}
          component={SubFeedContainer}
        >
          {items.map((item) => (
            <CSSTransition key={item.id} timeout={750} className='fade-750ms' unmountOnExit>
              {feedName === 'Vods' ? (
                <VodElement data={item} vodBtnDisabled={true} />
              ) : (
                <ClipElement data={item} user_name={channelInfo && channelInfo.name} />
              )}
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        items &&
        items.error && (
          <SubFeedContainer
            style={{
              minHeight: feedName === 'Vods' ? '310px' : '310px',
              paddingBottom: '0',
              width: `${numberOfVideos * (feedVideoSizeProps?.totalWidth || 350)}px`,
              margin: 'auto',
            }}
          >
            <Alert
              variant='info'
              style={{ width: '15%', minWidth: '250px', margin: 'auto', textAlign: 'center' }}
            >
              <b>{items.error}</b>
            </Alert>
          </SubFeedContainer>
        )
      )}

      <LoadMore
        show={items && !items.error}
        text='Load more'
        onClick={(dull, setLoaded) =>
          fetchItems({ pagination: itemPagination.current, setLoading: setLoaded })
        }
        style={{
          width: `${numberOfVideos * (feedVideoSizeProps?.totalWidth || 350)}px`,
          margin: 'auto',
        }}
      />
    </>
  );
};
export default SubFeed;
