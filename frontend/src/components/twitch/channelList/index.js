import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { CSSTransition } from "react-transition-group";

import {
  GameListUlContainer,
  SearchGameForm,
  SearchSubmitBtn,
  BackdropChannelList,
} from "./../categoryTopStreams/styledComponents";
import StyledLoadingList from "./../categoryTopStreams/LoadingList";
import ChannelListElement from "../channelList/ChannelListElement";
import AddVideoExtraData from "../AddVideoExtraData";
import GetFollowedChannels from "../GetFollowedChannels";

export default () => {
  const [channels, setChannels] = useState();
  const [listIsOpen, setListIsOpen] = useState();
  const inputRef = useRef();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: (event) => {
          setValue(event.target.value);
          if (listIsOpen && event.target.value === "") {
            // setListIsOpen(false);
          } else if (!listIsOpen && event.target.value) {
            setListIsOpen(true);
          }
        },
      },
      showValue: () => {
        return value;
      },
      returnChannel: () => {
        const foundChannel = channels.find((p_channel) => {
          return p_channel.user_name.toLowerCase().includes(value.toLowerCase());
        });
        if (foundChannel) {
          return foundChannel.user_name;
        } else {
          return value;
        }
      },
    };
  };

  //eslint-disable-next-line
  const {
    value: channel,
    bind: bindChannel,
    reset: resetChannel,
    showValue,
    returnChannel,
  } = useInput("");

  const channelObjectList = async (channelsList) => {
    try {
      return {
        data: {
          data: await channelsList.map((channel) => {
            return {
              user_id: channel.to_id || channel.user_id,
              user_name: channel.to_name || channel.user_name,
            };
          }),
        },
      };
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchFollowedChannels = useCallback(async () => {
    await GetFollowedChannels().then(async (res) => {
      if (res) {
        channelObjectList(res).then(async (res) => {
          await AddVideoExtraData(res, false).then(async (res) => {
            setChannels(res.data);
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    const input = showValue();
    if (!channels && (listIsOpen || (input && input.length >= 1))) {
      fetchFollowedChannels();
    }
  }, [showValue, listIsOpen, fetchFollowedChannels, channels]);

  useEffect(() => {
    const inputField = inputRef.current;
    inputField.addEventListener("focus", () => {
      setListIsOpen(true);
    });

    return () => {
      inputField.removeEventListener("focus", () => {
        setListIsOpen(true);
      });
    };
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetChannel();
    window.open(`/${returnChannel()}/channel/`);
  };

  return (
    <>
      <SearchGameForm onSubmit={handleSubmit} open={listIsOpen}>
        <input ref={inputRef} type='text' placeholder={"..."} {...bindChannel}></input>
        {channel && (
          <SearchSubmitBtn
            to={{
              pathname: `/${channel}/channel/`,
            }}
          />
        )}
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
            setChannels();
          }}
          unmountOnExit>
          <GameListUlContainer>
            {channels ? (
              <>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    margin: "9px 0",
                    color: "var(--VideoContainerLinks)",
                  }}>{`Total: ${channels.length}`}</p>

                {channels
                  .filter((channel) => {
                    return (
                      channel.user_name.toLowerCase().includes(showValue()) ||
                      channel.user_name.toUpperCase().includes(showValue())
                    );
                  })
                  .map((channel) => {
                    return <ChannelListElement key={channel.user_id} data={channel} />;
                  })}
              </>
            ) : (
              <StyledLoadingList amount={11} />
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
