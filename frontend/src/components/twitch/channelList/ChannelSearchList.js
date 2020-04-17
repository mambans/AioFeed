import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { throttle } from "lodash";
import { MdFormatListBulleted } from "react-icons/md";

import {
  GameListUlContainer,
  SearchGameForm,
  SearchSubmitBtn,
} from "./../categoryTopStreams/styledComponents";
import StyledLoadingList from "./../categoryTopStreams/LoadingList";
import ChannelListElement from "../channelList/ChannelListElement";
import AddVideoExtraData from "../AddVideoExtraData";
import GetFollowedChannels from "../GetFollowedChannels";
import { CSSTransition } from "react-transition-group";

export default () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState();
  const [listIsOpen, setListIsOpen] = useState();

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
          if (event.target.value && event.target.value.length >= 2) {
          }
          if (listIsOpen && event.target.value === "") {
            setListIsOpen(false);
          } else if (!listIsOpen && event.target.value) {
            setListIsOpen(true);
          }
        },
      },
      showValue: () => {
        return value;
      },
    };
  };

  //eslint-disable-next-line
  const { value: channel, bind: bindChannel, reset: resetChannel, showValue } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetChannel();
    navigate(`/${channel}/channel/`);
  };

  const channelObjectList = async (channelsList) => {
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
  };

  const fetchFollowedChannels = useMemo(
    () =>
      throttle(
        () => {
          GetFollowedChannels().then(async (res) => {
            if (res) {
              channelObjectList(res).then(async (res) => {
                await AddVideoExtraData(res, false).then(async (res) => {
                  setChannels(res.data);
                });
              });
            }
          });
        },
        60000,
        { leading: true, trailing: false }
      ),
    []
  );

  useEffect(() => {
    const input = showValue();
    if (!channels && (listIsOpen || (input && input.length >= 2))) {
      fetchFollowedChannels();
    }
  }, [showValue, listIsOpen, fetchFollowedChannels, channels]);

  return (
    <>
      <SearchGameForm onSubmit={handleSubmit} open={listIsOpen}>
        <input type='text' placeholder={"..."} {...bindChannel}></input>
        {channel && (
          <Link
            to={{
              pathname: `/${channel.toLowerCase()}/channel/`,
            }}>
            <SearchSubmitBtn />
          </Link>
        )}
        <MdFormatListBulleted
          id='ToggleListBtn'
          onClick={() => {
            setListIsOpen(!listIsOpen);
            resetChannel();
          }}
          size={42}
        />
        <CSSTransition in={listIsOpen} timeout={250} classNames='fade-250ms' unmountOnExit>
          <GameListUlContainer>
            {channels ? (
              <>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    margin: "9px 0",
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
              <StyledLoadingList amount={12} />
            )}
          </GameListUlContainer>
        </CSSTransition>
      </SearchGameForm>
    </>
  );
};
