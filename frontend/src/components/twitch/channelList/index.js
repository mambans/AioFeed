import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import { useParams } from 'react-router-dom';
import { throttle } from 'lodash';

import {
  GameListUlContainer,
  SearchGameForm,
  SearchSubmitBtn,
  BackdropChannelList,
} from './../categoryTopStreams/styledComponents';
import AddVideoExtraData from '../AddVideoExtraData';
import API from '../API';
import ChannelListElement from '../channelList/ChannelListElement';
import getMyFollowedChannels from '../getMyFollowedChannels';
import getFollowedOnlineStreams from '../live/GetFollowedStreams';
import handleArrowNavigation from './handleArrowNavigation';
import InifinityScroll from './InifinityScroll';
import sortByInput from './sortByInput';
import StyledLoadingList from './../categoryTopStreams/LoadingList';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import useToken from '../useToken';

const removeDuplicates = (items) =>
  items.filter((item, index, self) => {
    return self.findIndex((t) => t.user_id === item.user_id) === index;
  });

export default ({
  showButton = true,
  style = {},
  inputStyle = {},
  placeholder = 'Channel..',
  position,
}) => {
  const channelName = useParams()?.channelName;

  const [listIsOpen, setListIsOpen] = useState();
  const [cursor, setCursor] = useState({ position: 0 });
  const [showDropdown, setShowDropdown] = useState(true);
  const [followedChannels, setFollowedChannels] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const validateToken = useToken();

  const inputRef = useRef();
  const ulListRef = useRef();
  const searchTimer = useRef();
  const savedFilteredInputMatched = useRef();

  useLockBodyScroll(listIsOpen);

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          const { value: input } = event.target;
          try {
            setValue(input);
            setCursor({ position: 0 });
            if (listIsOpen && input && input !== '' && !cursor.used) {
              clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(async () => {
                setSearchResults();
                await API.getSearchChannels({
                  query: input || value,
                  params: { first: 20 },
                })
                  .then((res) => {
                    const searchResult = res.data.data.map((item) => ({
                      ...item,
                      user_id: item.id,
                      user_name: item.display_name,
                    }));

                    AddVideoExtraData({
                      items: { data: searchResult },
                      fetchGameInfo: true,
                      fetchProfiles: true,
                      saveNewProfiles: false,
                    }).then((finalChannels) => {
                      setSearchResults({
                        data: finalChannels?.data,
                        nextPage: res.data.pagination?.cursor,
                        query: input,
                      });
                    });
                  })
                  .catch((e) => {
                    console.error('e', e);
                  });
              }, 500);
            } else if (listIsOpen && !input) {
              setSearchResults();
            } else if (!listIsOpen && input) {
              setListIsOpen(true);
            }
          } catch (error) {
            console.log('useInput -> error', error);
          }
        },
      },
      returnChannel: () => {
        const foundChannel = filteredInputMatched?.data?.find((p_channel) => {
          return p_channel.user_name?.toLowerCase().includes(value?.toLowerCase());
        });

        if (foundChannel) return `${foundChannel.user_name}${!foundChannel.live ? '/page' : ''}`;

        return value;
      },
    };
  };

  const {
    value: channel,
    bind: bindChannel,
    reset: resetChannel,
    setValue: setChannel,
    returnChannel,
  } = useInput('');

  const filteredInputMatched = useMemo(() => {
    if (cursor.used) return savedFilteredInputMatched.current;

    const filteredFollowedChannels = sortByInput(channel, followedChannels);

    const uniqueChannels = removeDuplicates([
      ...(filteredFollowedChannels || []),
      ...(searchResults?.data || []),
    ]);

    const fianllObj = {
      data: uniqueChannels,
      nextPage: searchResults?.nextPage,
    };

    savedFilteredInputMatched.current = fianllObj;

    return fianllObj;
  }, [channel, followedChannels, searchResults, cursor.used]);

  const fetchFollowedChannels = useMemo(
    () =>
      throttle(
        async () => {
          validateToken().then(
            getMyFollowedChannels().then(async (channels) => {
              channelListToObject(channels).then(async (res) => {
                await AddVideoExtraData({
                  items: res?.data,
                  fetchGameInfo: false,
                  fetchProfiles: true,
                }).then(async (res) => {
                  const liveStreams = await getFollowedOnlineStreams({
                    followedchannels: res?.data,
                    fetchGameInfo: true,
                    fetchProfiles: false,
                  }).then((res) => res.data);

                  const channels = await res?.data?.map((item) => {
                    const found = liveStreams?.find((stream) => item.user_id === stream.user_id);
                    return {
                      ...item,
                      ...found,
                      live: found?.type === 'live',
                    };
                  });

                  setFollowedChannels(channels);
                });
              });
            })
          );
        },
        2500,
        { leading: true, trailing: false }
      ),
    [validateToken]
  );

  const channelListToObject = async (channelsList) => {
    try {
      return {
        data: {
          data: await channelsList?.map((channel) => {
            return {
              user_id: channel.to_id || channel.user_id,
              user_name: channel.to_name || channel.user_name,
            };
          }),
        },
      };
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleArrowKey = (event) =>
    handleArrowNavigation(
      event,
      filteredInputMatched?.data,
      cursor,
      setCursor,
      setChannel,
      ulListRef.current
    );

  const observerFunction = async () => {
    if (channel && searchResults?.nextPage && !loadingMore) {
      setLoadingMore(true);
      await API.getSearchChannels({
        query: channel,
        params: { first: 20, after: searchResults?.nextPage },
      })
        .then((res) => {
          const searchResult = res.data.data.map((item) => ({
            ...item,
            user_id: item.id,
            user_name: item.display_name,
          }));

          AddVideoExtraData({
            items: { data: searchResult },
            fetchGameInfo: true,
            fetchProfiles: true,
            saveNewProfiles: false,
          }).then((finallChannels) => {
            setSearchResults((curr) => ({
              data: [...(curr?.data || []), ...(finallChannels?.data || [])],
              nextPage: res?.data.pagination?.cursor,
              query: channel,
            }));
            setLoadingMore(false);
          });
        })
        .catch((e) => {
          console.error('e', e);
        });
    }
    return false;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetChannel();
    window.open(`/${returnChannel()}`);
    setListIsOpen(false);
    inputRef.current.blur();
  };

  useEffect(() => {
    if (listIsOpen) {
      fetchFollowedChannels().catch((e) => {
        setShowDropdown(false);
        console.warn(e);
      });
    }
  }, [listIsOpen, fetchFollowedChannels]);

  return (
    <>
      <SearchGameForm
        style={{ ...style }}
        showButton={showButton}
        onSubmit={handleSubmit}
        open={listIsOpen}
        onKeyDown={handleArrowKey}
        text={channel}
        direction={'left'}
      >
        <input
          ref={inputRef}
          style={{ ...inputStyle }}
          type='text'
          spellCheck='false'
          placeholder={`${channelName || placeholder}`}
          onFocus={() => setListIsOpen(true)}
          {...bindChannel}
        />
        <SearchSubmitBtn
          disabled={!channel}
          to={{
            pathname: `/${channel}/page/`,
          }}
        />
        {showButton && (
          <MdFormatListBulleted
            id='ToggleListBtn'
            onClick={() => {
              resetChannel();
              setListIsOpen(!listIsOpen);
            }}
            size={42}
          />
        )}
        <CSSTransition
          in={showDropdown && listIsOpen}
          timeout={250}
          classNames='fade-250ms'
          onExited={() => {
            setCursor({ position: 0 });
            resetChannel();
            setFollowedChannels();
            setSearchResults();
          }}
          unmountOnExit
        >
          <GameListUlContainer ref={ulListRef} style={{ paddingLeft: '0' }} position={position}>
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                margin: '9px 0',
                color: 'var(--VideoContainerLinks)',
              }}
            >{`Total: ${
              filteredInputMatched?.data?.length === 0
                ? '...'
                : filteredInputMatched?.data?.length || '...'
            }`}</p>
            {filteredInputMatched?.data?.length === 0 && channel ? (
              <>
                <ChannelListElement
                  key={channel}
                  searchInput={channel}
                  selected={true}
                  followingStatus={false}
                />
                <StyledLoadingList amount={3} style={{ paddingLeft: '10px' }} />
              </>
            ) : filteredInputMatched?.data.length >= 1 ? (
              <>
                {filteredInputMatched?.data.map((channel, index) => {
                  return (
                    <ChannelListElement
                      key={channel.user_id}
                      data={channel}
                      selected={index === cursor.position}
                      followingStatus={Boolean(
                        followedChannels?.find((item) => item?.user_id === channel?.user_id)
                      )}
                    />
                  );
                })}

                {channel && <InifinityScroll observerFunction={observerFunction} />}
              </>
            ) : (
              <StyledLoadingList amount={11} style={{ paddingLeft: '10px' }} />
            )}
          </GameListUlContainer>
        </CSSTransition>
      </SearchGameForm>
      {listIsOpen && (
        <BackdropChannelList id='BackdropChannelList' onClick={() => setListIsOpen(!listIsOpen)} />
      )}
    </>
  );
};
