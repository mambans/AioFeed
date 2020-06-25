import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Alert } from 'react-bootstrap';
import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

import { SubFeedContainer, LoadMore } from './../../sharedStyledComponents';
import { SubFeedHeader } from './StyledComponents';
import ClipsSortButton from './ClipsSortButton';
import SortButton from './SortButton';
import ClipElement from './ClipElement';
import VodElement from '../vods/VodElement';

export default ({
  feedName,
  items,
  sortBy,
  setSortBy,
  setSortData,
  fetchItems,
  itemPagination,
  itemsloadmoreLoaded,
  channelInfo,
}) => {
  const [numberOfVideos, setNumberOfVideos] = useState(
    Math.floor(document.documentElement.clientWidth / 350),
  );
  // const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);

  const recalcWidth = useMemo(
    () =>
      debounce(
        () => {
          setNumberOfVideos(Math.floor(document.documentElement.clientWidth / 350));
        },
        20,
        { leading: true, trailing: false },
      ),
    [],
  );

  useEffect(() => {
    window.addEventListener('resize', recalcWidth);

    return () => {
      window.removeEventListener('resize', recalcWidth);
    };
  }, [recalcWidth]);

  return (
    <>
      <SubFeedHeader
        style={{
          width: `${numberOfVideos * 350}px`,
        }}
      >
        {feedName === 'Vods' ? (
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
            width: `${numberOfVideos * 350}px`,
            margin: 'auto',
          }}
          component={SubFeedContainer}
        >
          {items.map((item) => {
            return (
              <CSSTransition key={item.id} timeout={750} className='fade-750ms' unmountOnExit>
                {feedName === 'Vods' ? (
                  <VodElement data={item} vodBtnDisabled={true} />
                ) : (
                  <ClipElement data={item} user_name={channelInfo && channelInfo.name} />
                )}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      ) : (
        items &&
        items.error && (
          <SubFeedContainer
            style={{
              minHeight: feedName === 'Vods' ? '310px' : '310px',
              paddingBottom: '0',
              width: `${numberOfVideos * 350}px`,
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
        loaded={itemsloadmoreLoaded}
        onClick={() => {
          fetchItems(itemPagination.current);
        }}
        style={{
          width: `${numberOfVideos * 350}px`,
          margin: 'auto',
        }}
      />
    </>
  );
};
