import { MdVideoCall } from "react-icons/md";
import { MdVideocam } from "react-icons/md";
import { MdVideocamOff } from "react-icons/md";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useState, useContext, useRef, useEffect } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import VodsContext from "./VodsContext";
import AccountContext from "./../../account/AccountContext";
import { VodRemoveButton, VodAddButton } from "./../../sharedStyledComponents";

export default ({ channel, lowerOpacity, marginRight }) => {
  const { channels, setChannels } = useContext(VodsContext);
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const vodButton = useRef();

  const [vodsEnabled, setVodsEnabled] = useState(channels.includes(channel.toLowerCase()));

  async function addChannel(channel) {
    try {
      channels.unshift(channel.toLowerCase());
      setChannels([...channels]);
      setVodsEnabled(true);

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: channels,
          }
        )
        .catch(error => {
          console.error(error);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  async function removeChannel(channel) {
    try {
      const index = channels.indexOf(channel.toLowerCase());
      channels.splice(index, 1);
      setChannels([...channels]);
      setVodsEnabled(false);

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: channels,
          }
        )
        .catch(err => {
          console.error(err);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (vodButton.current) {
      const refEle = vodButton.current;
      refEle.addEventListener("mouseenter", handleMouseOver);
      refEle.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, []);

  if (vodsEnabled) {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 300, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${"bottom"}`}>
            Remove <strong>{channel}</strong> vods.
          </Tooltip>
        }>
        <VodRemoveButton
          className='VodButton'
          marginRight={marginRight}
          ref={vodButton}
          lowerOpacity={lowerOpacity}
          title={"Remove " + channel + " vods."}
          variant='link'
          onClick={() => {
            removeChannel(channel);
          }}>
          {isHovered ? (
            <MdVideocamOff size={24} color='red' />
          ) : (
            <MdVideocam size={24} color='green' />
          )}
        </VodRemoveButton>
      </OverlayTrigger>
    );
  } else {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 300, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${"bottom"}`}>
            Add <strong>{channel}</strong> vods.
          </Tooltip>
        }>
        <VodAddButton
          className='VodButton'
          marginRight={marginRight}
          ref={vodButton}
          title={"Add " + channel + " vods."}
          variant='link'
          onClick={() => {
            addChannel(channel);
          }}>
          <MdVideoCall size={24} />
        </VodAddButton>
      </OverlayTrigger>
    );
  }
};
