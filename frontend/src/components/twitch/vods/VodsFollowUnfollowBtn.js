import { MdVideoCall } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import { MdVideocamOff } from 'react-icons/md';
import axios from 'axios';
import React, { useState, useContext, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import AccountContext from './../../account/AccountContext';
import { VodAddRemoveButton } from './../../sharedStyledComponents';
import AddVodChannel from './AddVodChannel';
import { getLocalstorage } from '../../../util/Utils';
import VodsContext from './VodsContext';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';

/**
 * @param {String} channel - channel name
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 */

export default ({ channel, loweropacity, marginright }) => {
  const channels = getLocalstorage('VodChannels');
  const { vods, setVods } = useContext(VodsContext) || {};
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const [vodEnabled, setVodEnabled] = useState(channels.includes(channel?.toLowerCase()));
  const vodButton = useRef();

  useEventListenerMemo('mouseenter', handleMouseOver, vodButton.current);
  useEventListenerMemo('mouseleave', handleMouseOut, vodButton.current);

  function handleMouseOver() {
    setIsHovered(true);
  }

  function handleMouseOut() {
    setIsHovered(null);
  }

  async function removeChannel(channel) {
    try {
      const vodChannels = new Set(channels || getLocalstorage('VodChannels') || []);

      vodChannels.delete(channel?.toLowerCase());
      localStorage.setItem('VodChannels', JSON.stringify(Array.from(vodChannels)));

      const existingVodVideos = vods;
      const newVodVideos = {
        ...existingVodVideos,
        data: existingVodVideos.data.filter((video) => {
          return video.user_name.toLowerCase() !== channel?.toLowerCase();
        }),
      };

      localStorage.setItem('Vods', JSON.stringify(newVodVideos));
      setVods(newVodVideos);

      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/vodchannels`, {
          username: username,
          authkey: authKey,
          channels: Array.from(vodChannels),
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <OverlayTrigger
      key={'bottom'}
      placement={'bottom'}
      delay={{ show: 500, hide: 0 }}
      overlay={
        <Tooltip id={`tooltip-${'bottom'}`}>
          {vodEnabled ? `Disable ${channel} vods` : `Enable ${channel} vods`}
        </Tooltip>
      }
    >
      <VodAddRemoveButton
        className='VodButton'
        marginright={marginright}
        ref={vodButton}
        loweropacity={loweropacity}
        vodenabled={vodEnabled.toString()}
        variant='link'
        onClick={() => {
          if (vodEnabled) {
            removeChannel(channel);
            setVodEnabled(false);
          } else {
            AddVodChannel({ channel, username, authKey });
            setVodEnabled(true);
          }
        }}
      >
        {vodEnabled ? (
          isHovered ? (
            <MdVideocamOff size={24} color='red' />
          ) : (
            <MdVideocam size={24} color='green' />
          )
        ) : (
          <MdVideoCall size={24} />
        )}
      </VodAddRemoveButton>
    </OverlayTrigger>
  );
};
