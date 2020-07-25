import { TiFlashOutline } from 'react-icons/ti';
import { TiFlash } from 'react-icons/ti';
import { IoIosFlashOff } from 'react-icons/io';
import axios from 'axios';
import React, { useState, useContext, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import AccountContext from './../account/AccountContext';
import { VodAddRemoveButton } from './../sharedStyledComponents';
import { getLocalstorage } from '../../util/Utils';
import useEventListener from '../../hooks/useEventListener';

/**
 * @param {String} channel - channel name
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Number} [size=24] - size of the Icons/Svgs;
 */

export default ({ channel, loweropacity, marginright, size = 24 }) => {
  const channels = getLocalstorage('UpdateNotificationsChannels') || [];
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const [updateNotificationEnabled, setUpdateNotificationEnabled] = useState(
    channels && channels.includes(channel.toLowerCase())
  );
  const vodButton = useRef();

  useEventListener('mouseenter', handleMouseOver, vodButton.current);
  useEventListener('mouseleave', handleMouseOut, vodButton.current);

  async function removeChannel(channel) {
    try {
      const channelss = new Set(getLocalstorage('UpdateNotificationsChannels') || []);
      channelss.delete(channel.toLowerCase());

      localStorage.setItem('UpdateNotificationsChannels', JSON.stringify(Array.from(channelss)));
      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/updatechannels`, {
          username: username,
          authkey: authKey,
          channels: Array.from(channelss),
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  async function addChannel() {
    try {
      const existing = new Set(getLocalstorage('UpdateNotificationsChannels') || []);

      const newChannels = Array.from(existing.add(channel.toLowerCase()));

      localStorage.setItem('UpdateNotificationsChannels', JSON.stringify(newChannels));
      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/updatechannels`, {
          username: username,
          authkey: authKey,
          channels: newChannels,
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log('error', error);
    }
  }

  function handleMouseOver() {
    setIsHovered(true);
  }

  function handleMouseOut() {
    setIsHovered(null);
  }

  return (
    <OverlayTrigger
      key={'bottom'}
      placement={'bottom'}
      delay={{ show: 500, hide: 0 }}
      overlay={
        <Tooltip id={`tooltip-${'bottom'}`}>
          {updateNotificationEnabled
            ? `Disable ${channel} stream title/game update notification.`
            : `Enable ${channel} stream title/game update notification`}
        </Tooltip>
      }
    >
      <VodAddRemoveButton
        className='StreamUpdateNoitificationsButton'
        marginright={marginright}
        ref={vodButton}
        loweropacity={loweropacity}
        vodenabled={updateNotificationEnabled.toString()}
        variant='link'
        onClick={() => {
          if (updateNotificationEnabled) {
            removeChannel(channel);
            setUpdateNotificationEnabled(false);
          } else {
            addChannel({ channel, username, authKey });
            setUpdateNotificationEnabled(true);
          }
        }}
      >
        {updateNotificationEnabled ? (
          isHovered ? (
            <IoIosFlashOff size={size} color='red' />
          ) : (
            <TiFlash size={size} color='green' />
          )
        ) : (
          <TiFlashOutline size={size} />
        )}
      </VodAddRemoveButton>
    </OverlayTrigger>
  );
};
