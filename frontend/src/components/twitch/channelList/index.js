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
import StyledLoadingList from './../categoryTopStreams/LoadingList';
import ChannelListElement from '../channelList/ChannelListElement';
import AddVideoExtraData from '../AddVideoExtraData';
import GetFollowedChannels from '../GetFollowedChannels';
import getFollowedOnlineStreams from '../live/GetFollowedStreams';

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
  var channelA = (a.user_name || a.name).toLowerCase();
  var channelB = (b.user_name || b.name).toLowerCase();
  return channelA.localeCompare(channelB);
};

export const sortInputFirst = (input, data) => {
  let caseSensitive = [];
  let caseInsensitive = [];
  let others = [];

  data.forEach((element) => {
    if ((element.user_name || element.name).slice(0, input.length) === input) {
      caseSensitive.push(element);
    } else if (
      (element.user_name || element.name).slice(0, input.length).toLowerCase() ===
      input.toLowerCase()
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

export default ({ showButton = true, style = {}, inputStyle = {}, placeholder = 'Channel..' }) => {
  const [filteredChannels, setFilteredChannels] = useState();
  const [listIsOpen, setListIsOpen] = useState();
  const [cursor, setCursor] = useState(0);
  const [showDropdown, setShowDropdown] = useState(true);
  const channels = useRef();
  const inputRef = useRef();
  const ulListRef = useRef();
  const channelName = useParams()?.channelName;

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          try {
            setCursor(0);
            setValue(event.target.value);
            if (listIsOpen && event.target.value && event.target.value !== '') {
              const filtered = channels.current?.filter((channel) => {
                return channel.user_name
                  .toLowerCase()
                  .includes((event.target.value || value).toLowerCase());
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
          } catch (error) {
            console.log('useInput -> error', error);
          }
        },
      },
      showValue: () => {
        return value;
      },
      returnChannel: () => {
        const foundChannel = filteredChannels?.find((p_channel) => {
          return p_channel.user_name.toLowerCase().includes(value.toLowerCase());
        });
        if (foundChannel) {
          return `${foundChannel.user_name}${!foundChannel.live ? '/channel' : ''}`;
        } else {
          return value;
        }
      },
      manualSet: setValue,
    };
  };

  //eslint-disable-next-line
  const {
    value: channel,
    bind: bindChannel,
    reset: resetChannel,
    showValue,
    returnChannel,
    manualSet,
  } = useInput('');

  const channelObjectList = async (channelsList) => {
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

  const fetchFollowedChannels = useMemo(
    () =>
      throttle(
        async () => {
          await GetFollowedChannels()
            .then(async (res) => {
              channelObjectList(res)
                .then(async (res) => {
                  await AddVideoExtraData({ items: res?.data, fetchGameInfo: false })
                    .then(async (res) => {
                      const liveStreams = await getFollowedOnlineStreams({
                        followedchannels: res?.data,
                        fetchGameInfo: true,
                        fetchProfiles: false,
                      }).then((res) => res.data);

                      channels.current = res?.data.map((item) => {
                        const found = liveStreams?.find(
                          (stream) => item.user_id === stream.user_id
                        );
                        return {
                          ...item,
                          ...found,
                          profile_img_url: item.profile_img_url,
                          live: found?.type === 'live',
                        };
                      });
                      setFilteredChannels(
                        res?.data.map((item) => {
                          const found = liveStreams?.find(
                            (stream) => item.user_id === stream.user_id
                          );
                          return {
                            ...item,
                            ...found,
                            profile_img_url: item.profile_img_url,
                            live: found?.type === 'live',
                          };
                        })
                      );
                    })
                    .catch((e) => {
                      if (!channels.current) setShowDropdown(false);
                      console.warn(e);
                    });
                })
                .catch((e) => {
                  if (!channels.current) setShowDropdown(false);
                  console.warn(e);
                });
            })
            .catch((e) => {
              if (!channels.current) setShowDropdown(false);
              console.warn(e);
            });
        },
        5000,
        { trailing: false, leading: true }
      ),
    []
  );

  const handleArrowKey = (e) => {
    try {
      if (filteredChannels?.length > 1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor + 1, 0), filteredChannels.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Down');
          manualSet(filteredChannels[cursor + 1].user_name);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor - 1, 0), filteredChannels.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Up');
          manualSet(filteredChannels[cursor - 1].user_name);
        }
      }
    } catch (error) {
      console.log('handleArrowKey -> error', error);
    }
  };

  useEffect(() => {
    const input = showValue();
    if (!channels.current && (listIsOpen || input?.length >= 1)) {
      fetchFollowedChannels();
    }
  }, [showValue, listIsOpen, fetchFollowedChannels]);

  useEffect(() => {
    const inputField = inputRef.current;
    inputField.addEventListener('focus', () => {
      setListIsOpen(true);
    });

    return () => {
      inputField.removeEventListener('focus', () => {
        setListIsOpen(true);
      });
    };
  }, []);

  useEffect(() => {
    if (channels.current) {
      return () => {
        setFilteredChannels(channels.current || []);
      };
    }
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetChannel();
    window.open(`/${returnChannel()}`);
    setListIsOpen(false);
    inputRef.current.blur();
  };

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
          style={{ ...inputStyle }}
          ref={inputRef}
          type='text'
          placeholder={`${channelName || placeholder}`}
          {...bindChannel}
          spellCheck='false'
        />
        <SearchSubmitBtn
          disabled={!channel}
          to={{
            pathname: `/${channel}/channel/`,
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
            channels.current = null;
            setCursor(0);
          }}
          unmountOnExit
        >
          <GameListUlContainer ref={ulListRef} style={{ paddingLeft: '0' }}>
            {filteredChannels?.length === 0 ? (
              <ChannelListElement
                key={channel}
                searchInput={channel}
                selected={true}
                followingStatus={false}
              />
            ) : filteredChannels ? (
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
                {channel &&
                  channel !== '' &&
                  !filteredChannels?.find((item) => item.user_name === channel) && (
                    <ChannelListElement
                      key={channel}
                      searchInput={channel}
                      // selected={true}
                      followingStatus={false}
                      style={{
                        borderBottom: 'thin dotted #7b7b7b',
                        borderTop: 'thin dotted #7b7b7b',
                        marginBottom: '10px',
                        marginTop: '10px',
                      }}
                    />
                  )}
                {filteredChannels.map((channel, index) => {
                  return (
                    <ChannelListElement
                      key={channel.user_id}
                      data={channel}
                      selected={index === cursor}
                    />
                  );
                })}
              </>
            ) : (
              <StyledLoadingList amount={11} style={{ paddingLeft: '10px' }} />
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
