import React, { useContext, useMemo, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

import SearchList from './../SearchList';
import { addFavoriteVideo, removeFavoriteVideo } from './buttonList/ButtonLists';
import FavoritesContext from './FavoritesContext';
import {
  GameListUlContainer,
  StyledGameListElement,
} from '../twitch/categoryTopStreams/styledComponents';
import handleArrowNavigation, {
  scrollToIfNeeded,
} from '../twitch/channelList/handleArrowNavigation';
import { videoImageUrls } from './../youtube/YoutubeVideoElement';
import { parseNumberAndString } from './dragDropUtils';
import { ListActionButton } from './StyledComponents';
import ToolTip from '../ToolTip';

export default ({ list, listName, videos, style }) => {
  const { lists, setLists } = useContext(FavoritesContext);
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
          setValue(input.trim());
          setCursor({ position: 0 });

          // if (listIsOpen && input && input !== '' && !cursor.used) {
          // }
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
    const id = videoId;

    if (Boolean(id) && Boolean(filteredInputMatched?.length)) {
      const selectedVideo = returnFirstMatch();
      const navigateToUrl = constructYUrlLink(selectedVideo);

      window.open(navigateToUrl);
      // : navigate(`/category/${returnFirstMatch()}`);
    } else {
      setCursor({ position: 0 });
      await addFavoriteVideo(lists, setLists, listName, id);
      setTimeout(() => {
        setCursor({ position: list.items.length - 1 });
        scrollToIfNeeded(ulListRef.current, ulListRef.current.querySelector(`#V${id}`), 'Down');
      }, 100);
    }
    resetVideoId();
  };

  const constructYUrlLink = (v = {}) => {
    if (v?.kind === 'youtube#video' && v?.contentDetails)
      return `/youtube/${v.id}?list=${listName}`;

    if (typeof parseNumberAndString(v.id) === 'number')
      return `/${v?.login || v?.user_name}/videos/${v.id}?list=${listName}`;

    return `/youtube/${v.id}?list=${listName}`;
  };

  const filteredInputMatched = useMemo(() => {
    if (cursor.used) return savedFilteredInputMatched.current;

    const input = String(videoId)?.toLowerCase();
    const inputFiltered = Boolean(input)
      ? videos?.filter((v) => {
          return (
            v?.title?.toLowerCase().includes(input) ||
            v?.snippet?.title?.toLowerCase().includes(input) ||
            v?.snippet?.channelTitle?.toLowerCase().includes(input) ||
            v?.login?.toLowerCase().includes(input) ||
            v?.user_name?.toLowerCase().includes(input) ||
            v?.id?.toLowerCase().includes(input)
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
      leftIcon={<MdAdd size={16} type='submitBtn' onClick={handleSubmit} />}
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
                id={`V${v.id}`}
                selected={index === cursor.position}
                className={index === cursor.position ? 'selected' : ''}
                imgWidth={`${(30 / 9) * 16}px`}
                style={{ fontSize: '0.9em' }}
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
                  onClick={() => removeFavoriteVideo(lists, setLists, listName, v.id)}
                />
              </StyledGameListElement>
            </ToolTip>
          ))}
        </GameListUlContainer>
      )}
    </SearchList>
  );
};
