import React, { useContext, useEffect, useRef, useState } from 'react';

import AddVideoExtraData from '../twitch/AddVideoExtraData';
import TwitchAPI from '../twitch/API';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from '../youtube/YoutubeVideoElement';
import GetVideoInfo from './GetVideoInfo';
import { TransitionGroup } from 'react-transition-group';
import { LoadingVideoElement } from '../twitch/StyledComponents';
import { addVodEndTime } from '../twitch/TwitchUtils';
import LoadMore from '../../components/loadMore/LoadMore';
import { CenterContext } from '../feed/FeedsCenterContainer';
import { parseNumberAndString } from './dragDropUtils';
// import aiofeedAPI from '../navigation/API';
import { VideosContainer } from '../../components/styledComponents';
import addVideoDataToVideos from './addVideoDataToVideos';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import MyListsContext from './MyListsContext';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import LoadingBoxes from '../twitch/LoadingBoxes';

export const fetchListVideos = async ({ list, currentVideos = [], videos }) => {
  if (videos || list?.videos) {
    const twitchFetchVideos = async (items) => {
      const fetchedVideos = await TwitchAPI.getVideos({ id: items }).catch((e) => {});

      if (!fetchedVideos) return false;

      const finallFetchedVideos = await AddVideoExtraData({
        items: fetchedVideos.data,
        fetchGameInfo: false,
      });

      return await addVodEndTime(finallFetchedVideos.data);
    };

    const youtubeFetchVideos = async (items) => await GetVideoInfo({ videos: items });

    const twitchItems = (videos || list.videos)
      .map((video) => typeof video === 'number' && video)
      .filter((i) => i);

    const youtubeItems = (videos || list.videos)
      .map((video) => typeof video === 'string' && video)
      .filter((i) => i && !currentVideos.find((v) => String(v.id) === String(i)));

    const twitchItemsWithDetails = Boolean(twitchItems?.length)
      ? await twitchFetchVideos(twitchItems)
      : twitchItems?.map((video) => ({ id: video, loading: true }));

    const youtubeItemsWithDetails = Boolean(youtubeItems?.length)
      ? await youtubeFetchVideos(youtubeItems)
      : youtubeItems.map((video) => {
          return { id: video, contentDetails: { upload: { videoId: video } }, loading: true };
        });

    const mergedVideosUnordered = [
      ...(twitchItemsWithDetails || []),
      ...(youtubeItemsWithDetails || []),
      ...currentVideos,
    ];

    const mergeVideosOrderedAndUnique = (videos || list?.videos)
      .map((item) => ({
        ...mergedVideosUnordered.find((video) => String(video?.id) === String(item)),
        list_id: list?.id,
      }))
      .filter((i) => i);

    return mergeVideosOrderedAndUnique;
  }
};

const List = ({
  list,
  setLists,
  setVideos,
  videos,
  savedVideosWithData,
  addSavedData,
  setLoading,
  loading,
  collapsed,
}) => {
  const [dragging, setDragging] = useState();
  const { videoElementsAmount, feedVideoSizeProps } = useContext(CenterContext) || {};
  const { editListOrder } = useContext(MyListsContext) || {};

  const [videosToShow, setVideosToShow] = useState({
    amount: videoElementsAmount / 2,
    timeout: 750,
    transitionGroup: 'videos',
  });
  const loadMoreRef = useRef();
  const wrapperRef = useRef();
  const scrollInterval = useRef();

  // useEffect(() => {
  //   setVideosToShow((cr) => ({
  //     amount: cr?.showAll && videos?.length ? videos?.length : videoElementsAmount / 2,
  //     timeout: 750,
  //     transitionGroup: 'videos',
  //     showAll: cr?.showAll,
  //   }));
  // }, [videoElementsAmount, videos]);

  useEffect(() => {
    (async () => {
      if (collapsed) return false;
      setLoading(true);
      const videoIds = list?.videos.slice(
        0,
        (videosToShow?.showAll && list?.videos?.length) ||
          Math.min(list?.videos?.length, videosToShow?.amount)
      );
      console.log('videoIds:', videoIds);

      const videosWithData = await addVideoDataToVideos({
        savedVideosWithData: savedVideosWithData.current,
        list,
        videos: videoIds,
      });
      loadMoreRef.current?.setLoading?.(false);

      console.log('videosWithData:', videosWithData);
      setLoading(false);
      setVideos((c) => videosWithData);
      addSavedData(videosWithData);
    })();
  }, [
    list,
    setVideos,
    savedVideosWithData,
    addSavedData,
    setLoading,
    videosToShow?.amount,
    videosToShow?.showAll,
    collapsed,
  ]);

  const onDragEnd = (video) => {
    setDragging(false);

    if (video.source.index !== video.destination.index) {
      editListOrder({
        id: list.id,
        videoId: parseNumberAndString(video.draggableId),
        index: video.destination.index,
      });
    }
  };
  console.log('list?.videos?.length:', list?.videos?.length);
  console.log('videos?.length:', videos?.length);
  console.log('videosToShow:', videosToShow);
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={(e) => {
        setDragging(true);
        // setTimeout(() => {
        //   wrapperRef.current.scrollLeft +=
        //     e.source.index * feedVideoSizeProps.totalWidth - width / 2;
        // }, 100);
      }}
    >
      <Droppable direction='horizontal' droppableId={String(list.id)}>
        {(provided) => (
          <div>
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ position: 'relative' }}
            >
              {dragging && (
                <>
                  <ScrollArea
                    marginTop={feedVideoSizeProps.margin}
                    height={feedVideoSizeProps.height - (feedVideoSizeProps.margin + 30) + 'px'}
                    width={feedVideoSizeProps.totalWidth / 2}
                    position='left'
                    onMouseEnter={() => {
                      requestAnimationFrame(() => (wrapperRef.current.scrollLeft -= 5));
                      scrollInterval.current = setInterval(
                        () => requestAnimationFrame(() => (wrapperRef.current.scrollLeft -= 15)),
                        3
                      );
                    }}
                    onMouseLeave={() => clearInterval(scrollInterval.current)}
                  >
                    <RiArrowLeftSLine />
                  </ScrollArea>
                  <ScrollArea
                    marginTop={feedVideoSizeProps.margin}
                    height={feedVideoSizeProps.height - (feedVideoSizeProps.margin + 30) + 'px'}
                    width={feedVideoSizeProps.totalWidth / 2}
                    position='right'
                    onMouseEnter={() => {
                      scrollInterval.current = setInterval(
                        () => requestAnimationFrame(() => (wrapperRef.current.scrollLeft += 15)),
                        3
                      );
                    }}
                    onMouseLeave={() => clearInterval(scrollInterval.current)}
                  >
                    <RiArrowRightSLine />
                  </ScrollArea>
                </>
              )}
              <VideosContainer dragging={dragging} ref={wrapperRef}>
                {!videos?.length && loading && !collapsed && <LoadingBoxes amount={4} />}
                <TransitionGroup
                  component={null}
                  className={videosToShow.transitionGroup || 'videos'}
                >
                  {videos.map((video, index) => {
                    return (
                      <Draggable key={video.id} draggableId={String(video.id)} index={index}>
                        {(provided) => (
                          // <CSSTransition
                          //   key={`${list.title}-${video.contentDetails?.upload?.videoId || video.id}`}
                          //   timeout={videosToShow.timeout}
                          //   classNames={video.transition || 'fade-750ms'}
                          //   unmountOnExit
                          // >
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {video.loading ? (
                              <LoadingVideoElement type={'small'} />
                            ) : typeof parseNumberAndString(video?.id) === 'string' ? (
                              // ) : String(parseInt(video?.id)) !== String(video?.id) ? (
                              // ) : video?.kind === 'youtube#video' ? (
                              <YoutubeVideoElement
                                listName={list.title}
                                list={list}
                                //data-id used for dragEvents
                                data-id={video.contentDetails?.upload?.videoId}
                                video={video}
                              />
                            ) : (
                              <VodElement
                                listName={list.title}
                                list={list}
                                //data-id used for dragEvents
                                data-id={video.id}
                                data={video}
                                vodBtnDisabled={true}
                              />
                            )}
                          </div>
                          // {/* </CSSTransition> */}
                        )}
                      </Draggable>
                    );
                  })}
                </TransitionGroup>
                {provided.placeholder}
              </VideosContainer>
            </div>
            {!!list?.videos?.length && !!videos?.length && (
              <LoadMore
                ref={loadMoreRef}
                onClick={() => {
                  loadMoreRef.current?.setLoading?.(true);
                  setVideosToShow((curr) => ({
                    amount: Math.min(list?.videos?.length, curr.amount + videoElementsAmount),
                    timeout: 750,
                    transitionGroup: 'videos',
                  }));
                }}
                onReset={() => {
                  setVideosToShow((curr) => ({
                    amount: videoElementsAmount / 2,
                    timeout: 750,
                    transitionGroup: 'videos',
                    //transitionGroup: 'instan-tdisappear',
                  }));
                  // clearTimeout(resetTransitionTimer.current);
                  // resetTransitionTimer.current = setTimeout(() => {
                  //   setVideosToShow((curr) => ({
                  //     amount: curr.amount,
                  //     timeout: 750,
                  //     transitionGroup: 'videos',
                  //   }));
                  // }, 750);
                }}
                reachedEnd={videos?.length >= list?.videos?.length}
                onShowAll={() => {
                  loadMoreRef.current?.setLoading?.(true);
                  setVideosToShow({
                    amount: list?.videos?.length,
                    timeout: 750,
                    transitionGroup: 'videos',
                    showAll: true,
                  });
                }}
              />
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default List;

export const ScrollArea = styled.div`
  position: absolute;
  right: ${({ position }) => (position === 'right' ? '0px' : 'unset')};
  left: ${({ position }) => (position === 'left' ? '0px' : 'unset')};
  height: ${({ height }) => height || '100%'};
  margin-top: ${({ marginTop }) => marginTop};
  background: rgba(0, 0, 0, 0);
  border-radius: 1rem;
  width: ${({ width }) => width || 150}px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  transition: background 250ms;

  svg {
    height: 50px;
    width: 50px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;
