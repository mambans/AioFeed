import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { Link } from 'react-router-dom';

import SearchList from '../sharedComponents/SearchList';
import { addFavoriteVideo, removeFavoriteVideo } from './addToListModal/AddToListModal';
import MyListsContext from './MyListsContext';
import {
  GameListUlContainer,
  StyledGameListElement,
} from '../twitch/categoryTopStreams/styledComponents';
import handleArrowNavigation, {
  scrollToIfNeeded,
} from '../twitch/channelList/handleArrowNavigation';
import { videoImageUrls } from '../youtube/YoutubeVideoElement';
import { parseNumberAndString } from './dragDropUtils';
import { ListActionButton, AddPlusIcon } from './StyledComponents';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';

const getYoutubeIdFromUrl = (videoId) => {
  const url = new URL(videoId);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get('v');
};

const MyListSmallList = ({ listName, videos, style, list, onChange }) => {
  const { setLists, editListOrder } = useContext(MyListsContext);
  const [listIsOpen, setListIsOpen] = useState();
  const [cursor, setCursor] = useState({ position: 0 });
  const [dragging, setDragging] = useState();

  const ulListRef = useRef();
  const scrollInterval = useRef();
  const scrollTimer = useRef();
  const savedFilteredInputMatched = useRef();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState();

    return {
      value,
      error,
      setValue,
      reset: () => {
        setValue('');
        onChange?.('');
      },
      manualSet: {
        onClick: (event) => setValue(event.target.textContent.trim()),
      },
      bind: {
        value,
        onChange: (event) => {
          event.preventDefault();
          event.stopPropagation();
          const { value: input } = event.target;
          setValue(input.trimStart());
          setCursor({ position: 0 });
          setError(null);
          onChange?.(input);
        },
      },
      setError,
      returnFirstMatch: () => filteredInputMatched[cursor.position],
    };
  };

  const {
    value: videoId,
    error,
    bind: bindvideoId,
    reset: resetVideoId,
    setValue: setVideoId,
    setError,
    returnFirstMatch,
    // returnChannel,
  } = useInput('');

  const handleArrowKey = (event) =>
    handleArrowNavigation(
      event,
      filteredInputMatched,
      cursor,
      setCursor,
      setVideoId,
      ulListRef.current,
      'title'
    );

  const addVideo = async (video_Id) => {
    if (Boolean(filteredInputMatched?.length)) {
      const selectedVideo = returnFirstMatch();
      const navigateToUrl = constructYUrlLink(selectedVideo);

      window.open(navigateToUrl);
      resetVideoId();

      // : navigate(`/category/${returnFirstMatch()}`);
    } else {
      const newList = await addFavoriteVideo({ setLists, id: list.id, videoId: video_Id });
      resetVideoId();
      if (newList) {
        setTimeout(() => setCursor({ position: newList?.videos?.length - 1 }), 0);
        clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => scrollToIfNeeded(ulListRef.current), 750);
      }
    }
  };

  function validateYoutubeVideoId(id, callback) {
    var img = new Image();
    img.src = 'http://img.youtube.com/vi/' + id + '/mqdefault.jpg';
    img.onload = function () {
      if (this.width === 120) return false;

      callback();
      return true;
    };
  }

  const handleSubmit = async () => {
    const video_Id = (() => {
      if (videoId?.includes('youtube.com/watch?v')) {
        return getYoutubeIdFromUrl(videoId);
      }

      if (
        videoId?.includes('twitch.tv/videos') ||
        (videoId?.includes('aiofeed.com') &&
          (videoId?.includes('/videos/') || videoId?.includes('/youtube/')))
      ) {
        const video = videoId.substring(videoId.lastIndexOf('/') + 1).split('?')[0];
        return video;
      }

      return videoId;
    })();

    const regExpForYoutube = new RegExp(/^[A-Za-z0-9_-]{11}$/);
    const regExpForTwitch = new RegExp(/^[0-9_-]{10}$/);

    if (Boolean(video_Id) && video_Id.match(regExpForTwitch)) {
      addVideo(video_Id);
      return;
    }
    if (Boolean(video_Id) && video_Id.match(regExpForYoutube)) {
      validateYoutubeVideoId(video_Id, () => addVideo(video_Id));
      return;
    }
    setError('Invalid Url/Video ID');
  };

  const constructYUrlLink = (v = {}) => {
    if (v?.kind === 'youtube#video' && v?.contentDetails)
      return `/youtube/${v?.id}?list=${listName}`;

    if (typeof parseNumberAndString(v?.id) === 'number')
      return `/${v?.login || v?.user_name}/videos/${v?.id}?list=${listName}`;

    return `/youtube/${v?.id}?list=${listName}`;
  };

  const checkIncludes = useCallback(
    (values) =>
      values.some((v) => String(v)?.toLowerCase?.().includes(String(videoId)?.toLowerCase?.())),
    [videoId]
  );

  const filteredInputMatched = useMemo(() => {
    if (cursor.used) return savedFilteredInputMatched.current;
    const input = String(videoId)?.toLowerCase?.();
    const youtubeVideoIdFromUrl =
      Boolean(input) && input?.includes('youtube.com/watch?v') && getYoutubeIdFromUrl(input);
    const twitchVideoIdFromUrl =
      (Boolean(input) && input?.includes('twitch.tv/videos')) ||
      (input?.includes('aiofeed.com') &&
        (input?.includes('/videos/') || input?.includes('/youtube/')) &&
        videoId.substring(videoId.lastIndexOf('/') + 1).split('?')[0]);

    const vids = list?.videos.map(
      (id) =>
        videos.find((video) => String(video?.id) === String(id)) || {
          id,
          thumbnail_url:
            typeof parseNumberAndString(id) === 'string'
              ? `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`
              : null,
        }
    );

    const inputFiltered = vids?.filter((v) => {
      if (!Boolean(input)) return v;
      return (
        checkIncludes([
          v?.title,
          v?.snippet?.title,
          v?.snippet?.channelTitle,
          v?.login,
          v?.user_name,
          v?.id,
        ]) ||
        v?.id?.toLowerCase?.()?.includes(youtubeVideoIdFromUrl) ||
        v?.id?.toLowerCase?.()?.includes(twitchVideoIdFromUrl)
      );
    });

    savedFilteredInputMatched.current = inputFiltered;

    return inputFiltered;
  }, [cursor.used, videos, videoId, checkIncludes, list?.videos]);

  useEffect(() => {
    return () => {
      clearTimeout(scrollTimer.current);
      clearInterval(scrollInterval.current);
    };
  }, []);

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

  return (
    <SearchList
      setListIsOpen={setListIsOpen}
      listIsOpen={listIsOpen}
      bindInput={bindvideoId}
      onSubmit={handleSubmit}
      resetInput={resetVideoId}
      showButton={false}
      placeholder={'video id..'}
      input={videoId}
      onKeyDown={handleArrowKey}
      setCursor={setCursor}
      keepListOpenOnSubmit={true}
      leftIcon={<AddPlusIcon size={24} type='submitBtn' onClick={handleSubmit} />}
      error={error}
      style={style}
    >
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
        <Droppable direction='vertical' droppableId={String(list.id)}>
          {(provided) =>
            Boolean(filteredInputMatched?.length) && (
              <>
                {dragging && ulListRef.current && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '310px',
                      maxHeight: '385px',
                      height: '385px',
                    }}
                  >
                    <ScrollArea
                      position='top'
                      onMouseEnter={() => {
                        requestAnimationFrame(() => (ulListRef.current.scrollTop -= 5));
                        scrollInterval.current = setInterval(
                          () => requestAnimationFrame(() => (ulListRef.current.scrollTop -= 35)),
                          3
                        );
                      }}
                      onMouseLeave={() => clearInterval(scrollInterval.current)}
                    >
                      <RiArrowUpSLine />
                    </ScrollArea>

                    <ScrollArea
                      position='bottom'
                      onMouseEnter={() => {
                        scrollInterval.current = setInterval(
                          () => requestAnimationFrame(() => (ulListRef.current.scrollTop += 35)),
                          3
                        );
                      }}
                      onMouseLeave={() => clearInterval(scrollInterval.current)}
                    >
                      <RiArrowDownSLine />
                    </ScrollArea>
                  </div>
                )}
                <GameListUlContainer ref={ulListRef} style={{ paddingTop: '10px' }}>
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredInputMatched?.map((v, index) => (
                      <Draggable key={v.id} draggableId={String(v.id)} index={index}>
                        {(provided) => (
                          <StyledGameListElement
                            key={v.id}
                            id={`${v.id}`}
                            selected={index === cursor.position}
                            className={index === cursor.position ? 'selected' : ''}
                            imgWidth={`${(30 / 9) * 16}px`}
                            style={{ fontSize: '0.9em' }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // onEntered={(node) => scrollToIfNeeded(ulListRef.current, node)}
                          >
                            <Link onClick={() => setListIsOpen(false)} to={constructYUrlLink(v)}>
                              <img
                                src={
                                  v?.thumbnail_url
                                    ?.replace('{width}', 300)
                                    ?.replace('{height}', 300) ||
                                  videoImageUrls(v?.snippet?.thumbnails)
                                }
                                alt=''
                              />
                              {v.title || v?.snippet?.title || v.id}
                            </Link>
                            <ListActionButton
                              size={16}
                              onClick={() =>
                                removeFavoriteVideo({ setLists, id: list.id, videoId: v.id })
                              }
                            >
                              <MdDeleteForever size={20} />
                            </ListActionButton>
                          </StyledGameListElement>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </GameListUlContainer>
              </>
            )
          }
        </Droppable>
      </DragDropContext>
    </SearchList>
  );
};

export default MyListSmallList;

const ScrollArea = styled.div`
  position: absolute;
  top: ${({ position }) => (position === 'top' ? '0px' : 'unset')};
  bottom: ${({ position }) => (position === 'bottom' ? '0px' : 'unset')};
  height: 50px;
  background: rgba(0, 0, 0, 0);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  transition: background 250ms;
  width: 100%;

  svg {
    height: 50px;
    width: 50px;
  }

  &:hover {
    background: rgba(0, 0, 0, 1.2);
  }
`;
