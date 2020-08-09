import React, { useState, useEffect, useRef } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';

import {
  GameListUlContainer,
  SearchGameForm,
  SearchSubmitBtn,
  BackdropChannelList,
} from './../../twitch/categoryTopStreams/styledComponents';
import StyledLoadingList from './../../twitch/categoryTopStreams/LoadingList';
import ChannelListElement from './ChannelListElement';
import { getLocalstorage } from '../../../util/Utils';
// import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';

export const scrollToIfNeeded = (parentDiv, childDiv, direction) => {
  const parentRect = parentDiv.getBoundingClientRect();
  const childRect = childDiv.getBoundingClientRect();

  const scrollDown =
    childRect.bottom + 20.5 >= parentRect.bottom || childRect.top + 20.5 >= parentRect.bottom;
  const scrollUp =
    childRect.top - 20.5 <= parentRect.top || childRect.bottom - 20.5 <= parentRect.top;

  if (scrollDown || scrollUp) {
    childDiv.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    parentDiv.scrollBy({
      top: direction === 'Down' && scrollDown ? +41 : direction === 'Up' && scrollUp ? -41 : 0,
      behavior: 'smooth',
    });
  }
};

const sortAlphaByProp = (a, b) => {
  var channelA = a.snippet.title.toLowerCase();
  var channelB = b.snippet.title.toLowerCase();
  return channelA.localeCompare(channelB);
};

export const sortInputFirst = (input, data) => {
  let caseSensitive = [];
  let caseInsensitive = [];
  let others = [];

  data.forEach((element) => {
    if (element.snippet.title.slice(0, input.length) === input) {
      caseSensitive.push(element);
    } else if (element.snippet.title.slice(0, input.length).toLowerCase() === input.toLowerCase()) {
      caseInsensitive.push(element);
    } else {
      others.push(element);
    }
  });

  caseSensitive.sort(sortAlphaByProp);
  caseInsensitive.sort(sortAlphaByProp);
  others.sort(sortAlphaByProp);
  return [...caseSensitive, ...caseInsensitive, ...others];
};

export default (data) => {
  const [filteredChannels, setFilteredChannels] = useState();
  const [listIsOpen, setListIsOpen] = useState();
  const [cursor, setCursor] = useState(0);
  const channels = useRef(
    getLocalstorage(`YT-followedChannels`) ? getLocalstorage(`YT-followedChannels`).data : []
  );
  const inputRef = useRef();
  const ulListRef = useRef();

  useLockBodyScroll(listIsOpen);

  // useEventListenerMemo(
  //   'focus',
  //   () => {
  //     setListIsOpen(true);
  //   },
  //   inputRef.current
  // );

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          setValue(event.target.value);
          if (listIsOpen && event.target.value && event.target.value !== '') {
            const filtered = channels.current.filter((channel) => {
              return channel.snippet.title
                .toLowerCase()
                .includes((event.target.value || value).toLowerCase());
            });
            if (filtered.length > 1) {
              const sorted = sortInputFirst(event.target.value || value, filtered);
              setFilteredChannels(sorted);
            } else {
              setFilteredChannels(filtered);
            }
          } else if (listIsOpen && !event.target.value) {
            setFilteredChannels(channels.current);
          } else if (!listIsOpen && event.target.value) {
            setListIsOpen(true);
          }
        },
      },
      returnChannelId: () => {
        const foundChannel = filteredChannels?.find((p_channel) => {
          return p_channel.snippet.title.toLowerCase().includes(value.toLowerCase());
        });

        return foundChannel && foundChannel.snippet.resourceId.channelId;
      },
      manualSet: setValue,
    };
  };

  //eslint-disable-next-line
  const {
    value: channel,
    bind: bindChannel,
    reset: resetChannel,
    returnChannelId,
    manualSet,
  } = useInput('');

  const handleArrowKey = (e) => {
    try {
      if (filteredChannels && filteredChannels.length > 1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor + 1, 0), filteredChannels.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Down');
          manualSet(filteredChannels[cursor + 1].snippet.title);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor - 1, 0), filteredChannels.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Up');
          manualSet(filteredChannels[cursor - 1].snippet.title);
        }
      }
    } catch (error) {
      console.log('handleArrowKey -> error', error);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetChannel();
    window.open(`https://www.youtube.com/channel/${returnChannelId()}`);
  };

  useEffect(() => {
    if (listIsOpen || !channels.current) {
      channels.current = getLocalstorage(`YT-followedChannels`)
        ? getLocalstorage(`YT-followedChannels`).data
        : [];
      setFilteredChannels(
        getLocalstorage(`YT-followedChannels`) ? getLocalstorage(`YT-followedChannels`).data : []
      );
    }
  }, [listIsOpen]);

  return (
    <>
      <SearchGameForm
        onSubmit={handleSubmit}
        open={listIsOpen}
        onKeyDown={handleArrowKey}
        direction={'left'}
        showButton={true}
      >
        <input
          ref={inputRef}
          type='text'
          spellCheck='false'
          placeholder={'...'}
          {...bindChannel}
          onFocus={() => {
            setListIsOpen(true);
          }}
        />
        <SearchSubmitBtn
          disabled={!channel}
          href={`https://www.youtube.com/channel/${returnChannelId()}`}
        />
        <MdFormatListBulleted
          id='ToggleListBtn'
          onClick={() => {
            resetChannel();
            setListIsOpen(!listIsOpen);
          }}
          size={42}
        />
        <CSSTransition
          in={listIsOpen}
          timeout={250}
          classNames='fade-250ms'
          onExited={() => {
            setCursor(0);
          }}
          unmountOnExit
        >
          <GameListUlContainer ref={ulListRef}>
            {filteredChannels ? (
              <>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    margin: '9px 0',
                    color: 'var(--VideoContainerLinks)',
                  }}
                >{`Total: ${filteredChannels.length}`}</p>

                {filteredChannels.map((channel, index) => {
                  return (
                    <ChannelListElement
                      key={channel.snippet.title}
                      channel={channel}
                      setNewChannels={(newChannels) => {
                        channels.current = newChannels;
                        setFilteredChannels(newChannels);
                      }}
                      videos={data.videos}
                      setVideos={data.setVideos}
                      selected={index === cursor}
                    />
                  );
                })}
              </>
            ) : (
              <StyledLoadingList amount={12} />
            )}
          </GameListUlContainer>
        </CSSTransition>
      </SearchGameForm>
      {listIsOpen && (
        <BackdropChannelList
          id='BackdropChannelList'
          onClick={() => {
            resetChannel();
            setListIsOpen(!listIsOpen);
          }}
        />
      )}
    </>
  );
};
