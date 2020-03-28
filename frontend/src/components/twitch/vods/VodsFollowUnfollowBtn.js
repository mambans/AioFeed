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
import AddVodChannel from "./AddVodChannel";

/**
 * @param {String} channel - channel name
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 */

export default ({ channel, loweropacity, marginright }) => {
  const { channels, setChannels } = useContext(VodsContext);
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const vodButton = useRef();

  async function removeChannel(channel) {
    try {
      const index = channels.indexOf(channel.toLowerCase());
      const existingChannels = [...channels];
      existingChannels.splice(index, 1);
      setChannels(existingChannels);
      localStorage.setItem("VodChannels", JSON.stringify(existingChannels));

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: existingChannels,
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

  if (channels.includes(channel.toLowerCase())) {
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
          marginright={marginright}
          ref={vodButton}
          loweropacity={loweropacity}
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
          marginright={marginright}
          ref={vodButton}
          title={"Add " + channel + " vods."}
          variant='link'
          onClick={() => {
            AddVodChannel({ channel, channels, setChannels, username, authKey });
          }}>
          <MdVideoCall size={24} />
        </VodAddButton>
      </OverlayTrigger>
    );
  }
};
