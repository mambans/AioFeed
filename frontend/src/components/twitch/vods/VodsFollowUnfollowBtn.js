import { MdVideoCall } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import { MdVideocamOff } from 'react-icons/md';
import axios from 'axios';
import React, { useState, useContext, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import AccountContext from './../../account/AccountContext';
import { VodAddRemoveButton } from './../../sharedStyledComponents';
import AddVodChannel from './AddVodChannel';
import VodsContext from './VodsContext';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import FetchSingelChannelVods from './FetchSingelChannelVods';
import FeedsContext from '../../feed/FeedsContext';

/**
 * @param {String} channel - channel name
 * @param {Number} channelId - user_id name
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Boolean} [show = true] - mount/show button.
 */

export default ({ channel, channelId, loweropacity, marginright, className, show = true }) => {
  const { vods, setVods, channels, setChannels } = useContext(VodsContext) || {};
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const vodEnabled = channels?.includes(channel?.toLowerCase());
  const vodButton = useRef();
  const { feedSizesObj } = useContext(FeedsContext) || {};

  useEventListenerMemo('mouseenter', handleMouseOver, vodButton.current);
  useEventListenerMemo('mouseleave', handleMouseOut, vodButton.current);

  function handleMouseOver() {
    setIsHovered(true);
  }

  function handleMouseOut() {
    setIsHovered(null);
  }

  async function removeChannel({ channel, channels, setChannels }) {
    try {
      const vodChannels = new Set(channels || []);

      vodChannels.delete(channel?.toLowerCase());
      setChannels([...vodChannels]);

      const existingVodVideos = vods;
      const newVodVideos = {
        ...existingVodVideos,
        data: existingVodVideos.data.filter((video) => {
          return video.user_name?.toLowerCase() !== channel?.toLowerCase();
        }),
      };

      setVods(newVodVideos);

      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/vodchannels`, {
          username: username,
          authkey: authKey,
          channels: Array.from(vodChannels),
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.log(e.message);
    }
  }

  if (!show) return null;

  return (
    <OverlayTrigger
      key={channel + 'VodFollowTooltip'}
      placement={'bottom'}
      delay={{ show: 500, hide: 0 }}
      overlay={
        <Tooltip id={`tooltip-${'bottom'}`}>
          {vodEnabled ? `Disable ${channel} vods` : `Enable ${channel} vods`}
        </Tooltip>
      }
    >
      <VodAddRemoveButton
        className={`VodButton ${className || ''}`}
        marginright={marginright}
        ref={vodButton}
        loweropacity={loweropacity}
        vodenabled={String(vodEnabled)}
        variant='link'
        onClick={() => {
          if (vodEnabled) {
            removeChannel({ channel, channels, setChannels });
          } else {
            AddVodChannel({ channel, channels, setChannels, username, authKey });
            if (channelId) {
              FetchSingelChannelVods({
                channelId,
                setVods,
                amount: 5,
                feedSizesObj,
              });
            }
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
