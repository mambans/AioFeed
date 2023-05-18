import React, { useState, useEffect, useRef } from 'react';

import { GameListUlContainer } from './../../twitch/categoryTopStreams/styledComponents';
import StyledLoadingList from './../../twitch/categoryTopStreams/LoadingList';
import ChannelListElement from './ChannelListElement';
import { getLocalstorage } from '../../../util';
import SearchList from '../../sharedComponents/SearchList';
import { scrollToIfNeeded } from '../../twitch/channelList/handleArrowNavigation';

const sortAlphaByProp = (a, b) => {
  var channelA = a.snippet.title?.toLowerCase();
  var channelB = b.snippet.title?.toLowerCase();
  return channelA.localeCompare(channelB);
};

export const sortInputFirst = (input, data) => {
  let caseSensitive = [];
  let caseInsensitive = [];
  let others = [];

  data.forEach((element) => {
    if (element.snippet.title.slice(0, input?.length) === input) {
      caseSensitive.push(element);
    } else if (
      element.snippet.title.slice(0, input?.length)?.toLowerCase() === input?.toLowerCase()
    ) {
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

const ChannelList = (data) => {
  const [filteredChannels, setFilteredChannels] = useState();
  const [listIsOpen, setListIsOpen] = useState();
  const [cursor, setCursor] = useState({ position: 0 });
  const channels = useRef(
    getLocalstorage(`YT-followedChannels`) ? getLocalstorage(`YT-followedChannels`).data : []
  );
  const ulListRef = useRef();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          event.preventDefault();
          event.stopPropagation();
          setValue(event.target.value);
          if (listIsOpen && event.target.value && event.target.value !== '') {
            const filtered = channels.current.filter((channel) => {
              return channel.snippet.title
                ?.toLowerCase()
                .includes((event.target.value || value)?.toLowerCase());
            });
            if (filtered?.length > 1) {
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
          return p_channel.snippet.title?.toLowerCase().includes(value?.toLowerCase());
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
      if (filteredChannels && filteredChannels?.length > 1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCursor((cursor) => ({
            position: Math.min(Math.max(cursor.position + 1, 0), filteredChannels?.length - 1),
          }));
          scrollToIfNeeded(ulListRef.current);
          manualSet(filteredChannels[cursor.position + 1]?.snippet?.title);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCursor((cursor) => ({
            position: Math.min(Math.max(cursor.position - 1, 0), filteredChannels?.length - 1),
          }));
          scrollToIfNeeded(ulListRef.current);
          manualSet(filteredChannels[cursor.position - 1]?.snippet?.title);
        }
      }
    } catch (error) {
      console.log('handleArrowKey -> error', error);
    }
  };

  const handleSubmit = () => {
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
      <SearchList
        onSubmit={handleSubmit}
        onKeyDown={handleArrowKey}
        showButton={true}
        setListIsOpen={setListIsOpen}
        listIsOpen={listIsOpen}
        input={channel}
        placeholder={'...'}
        setCursor={setCursor}
        resetInput={resetChannel}
        bindInput={bindChannel}
        searchBtnPath={`https://www.youtube.com/channel/${returnChannelId()}`}
      >
        <GameListUlContainer ref={ulListRef}>
          {filteredChannels ? (
            <>
              <p>{`Total: ${filteredChannels?.length}`}</p>

              {filteredChannels.map((channel, index) => (
                <ChannelListElement
                  key={channel.snippet.title}
                  channel={channel}
                  setNewChannels={(newChannels) => {
                    channels.current = newChannels;
                    setFilteredChannels(newChannels);
                  }}
                  videos={data.videos}
                  setVideos={data.setVideos}
                  selected={index === cursor.position}
                />
              ))}
            </>
          ) : (
            <StyledLoadingList amount={12} />
          )}
        </GameListUlContainer>
      </SearchList>
    </>
  );
};

export default ChannelList;
