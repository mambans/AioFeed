import React, { useState, useEffect, useRef } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { CSSTransition } from "react-transition-group";

import {
  GameListUlContainer,
  SearchGameForm,
  SearchSubmitBtn,
  BackdropChannelList,
} from "./../../twitch/categoryTopStreams/styledComponents";
import StyledLoadingList from "./../../twitch/categoryTopStreams/LoadingList";
import ChannelListElement from "./ChannelListElement";
import { getLocalstorage } from "../../../util/Utils";

export default (data) => {
  const [channels, setChannels] = useState(
    getLocalstorage(`YT-followedChannels`) ? getLocalstorage(`YT-followedChannels`).data : []
  );
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
        return value.toLowerCase();
      },
      returnChannelId: () => {
        const foundChannel = channels.find((p_channel) => {
          return p_channel.snippet.title.toLowerCase().includes(value.toLowerCase());
        });
        if (foundChannel) {
          return foundChannel.snippet.resourceId.channelId;
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
    returnChannelId,
  } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetChannel();
    // window.open(`/${channel}/channel/`);
    window.open(`https://www.youtube.com/channel/${returnChannelId()}`);
  };

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

  return (
    <>
      <SearchGameForm onSubmit={handleSubmit} open={listIsOpen}>
        <input ref={inputRef} type='text' placeholder={"..."} {...bindChannel}></input>
        {channel && (
          <SearchSubmitBtn href={`https://www.youtube.com/channel/${returnChannelId()}`} />
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
          // onExited={() => {
          //   setChannels();
          // }}
          unmountOnExit>
          <GameListUlContainer>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: "bold",
                margin: "9px 0",
                color: "var(--VideoContainerLinks)",
              }}>{`Total: ${channels.length}`}</p>
            {/* <TransitionGroup component={null}> */}
            {channels ? (
              channels
                .filter((channel) => {
                  return channel.snippet.title.toLowerCase().includes(showValue());
                })
                .map((channel) => {
                  return (
                    // <CSSTransition
                    //   key={channel.snippet.resourceId.channelId}
                    //   timeout={0}
                    //   classNames={"yt-ChannellistItem"}
                    //   // classNames="yt-ChannellistItem"
                    //   unmountOnExit>
                    <ChannelListElement
                      key={channel.snippet.resourceId.channelId}
                      channel={channel}
                      setChannels={setChannels}
                      videos={data.videos}
                      setVideos={data.setVideos}
                    />
                    // {/* </CSSTransition> */}
                  );
                })
            ) : (
              <StyledLoadingList amount={12} />
            )}
            {/* </TransitionGroup> */}
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
