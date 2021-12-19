import React, { useContext, useMemo, useRef, useState } from 'react';
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
import ToolTip from '../../components/tooltip/ToolTip';

const getYoutubeIdFromUrl = (videoId) => {
  const url = new URL(videoId);
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get('v');
};

const MyListSmallList = ({ listName, videos, style, list }) => {
  const { setLists } = useContext(MyListsContext);
  const [listIsOpen, setListIsOpen] = useState();
  const [cursor, setCursor] = useState({ position: 0 });

  const ulListRef = useRef();
  const savedFilteredInputMatched = useRef();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      manualSet: {
        onClick: (event) => setValue(event.target.textContent.trim()),
      },
      bind: {
        value,
        onChange: (event) => {
          const { value: input } = event.target;
          setValue(input.trimStart());
          setCursor({ position: 0 });
        },
      },
      returnFirstMatch: () => filteredInputMatched[cursor.position],
    };
  };

  const {
    value: videoId,
    bind: bindvideoId,
    reset: resetVideoId,
    setValue: setVideoId,
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

    if (Boolean(video_Id) && Boolean(filteredInputMatched?.length)) {
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
        setTimeout(() => scrollToIfNeeded(ulListRef.current), 750);
      }
    }
  };

  const constructYUrlLink = (v = {}) => {
    if (v?.kind === 'youtube#video' && v?.contentDetails)
      return `/youtube/${v?.id}?list=${listName}`;

    if (typeof parseNumberAndString(v?.id) === 'number')
      return `/${v?.login || v?.user_name}/videos/${v?.id}?list=${listName}`;

    return `/youtube/${v?.id}?list=${listName}`;
  };

  const filteredInputMatched = useMemo(() => {
    if (cursor.used) return savedFilteredInputMatched.current;
    const input = String(videoId)?.toLowerCase();
    const youtubeVideoIdFromUrl =
      Boolean(input) && input?.includes('youtube.com/watch?v') && getYoutubeIdFromUrl(input);
    const twitchVideoIdFromUrl =
      (Boolean(input) && input?.includes('twitch.tv/videos')) ||
      (input?.includes('aiofeed.com') &&
        (input?.includes('/videos/') || input?.includes('/youtube/')) &&
        videoId.substring(videoId.lastIndexOf('/') + 1).split('?')[0]);

    const inputFiltered = Boolean(input)
      ? videos?.filter((v) => {
          return (
            v?.title?.toLowerCase()?.includes(input) ||
            v?.snippet?.title?.toLowerCase()?.includes(input) ||
            v?.snippet?.channelTitle?.toLowerCase()?.includes(input) ||
            v?.login?.toLowerCase()?.includes(input) ||
            v?.user_name?.toLowerCase()?.includes(input) ||
            v?.id?.toLowerCase()?.includes(input) ||
            v?.id?.toLowerCase()?.includes(youtubeVideoIdFromUrl) ||
            v?.id?.toLowerCase()?.includes(twitchVideoIdFromUrl)
          );
        })
      : videos;

    savedFilteredInputMatched.current = inputFiltered;

    return inputFiltered;
  }, [cursor.used, videos, videoId]);

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
      style={style}
    >
      {Boolean(filteredInputMatched?.length) && (
        <GameListUlContainer ref={ulListRef} style={{ paddingTop: '10px' }}>
          {filteredInputMatched.map((v, index) => (
            <ToolTip
              key={v?.id + index}
              show={(v?.title || v?.snippet?.title || v?.id).length >= 30}
              tooltip={v?.title || v?.snippet?.title || v?.id}
            >
              <StyledGameListElement
                key={v.id}
                id={`${v.id}`}
                selected={index === cursor.position}
                className={index === cursor.position ? 'selected' : ''}
                imgWidth={`${(30 / 9) * 16}px`}
                style={{ fontSize: '0.9em' }}
                // onEntered={(node) => scrollToIfNeeded(ulListRef.current, node)}
              >
                <Link
                  onClick={() => setListIsOpen(false)}
                  to={{
                    pathname: constructYUrlLink(v),
                  }}
                >
                  <img
                    src={
                      v?.thumbnail_url?.replace('{width}', 300)?.replace('{height}', 300) ||
                      videoImageUrls(v?.snippet?.thumbnails)
                    }
                    alt=''
                  />
                  {v.title || v?.snippet?.title || v.id}
                </Link>
                <ListActionButton
                  size={16}
                  onClick={() => removeFavoriteVideo({ setLists, id: list.id, videoId: v.id })}
                >
                  <MdDeleteForever size={20} />
                </ListActionButton>
              </StyledGameListElement>
            </ToolTip>
          ))}
        </GameListUlContainer>
      )}
    </SearchList>
  );
};

export default MyListSmallList;
