import { TiFlashOutline } from 'react-icons/ti';
import { TiFlash } from 'react-icons/ti';
import { IoIosFlashOff } from 'react-icons/io';
import axios from 'axios';
import React, { useState, useContext, useRef } from 'react';

import AccountContext from './../account/AccountContext';
import { VodAddRemoveButton } from './../sharedComponents/sharedStyledComponents';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import VodsContext from './vods/VodsContext';
import ToolTip from '../sharedComponents/ToolTip';

export const removeChannel = async ({
  channel,
  updateNotischannels,
  setUpdateNotischannels,
  username,
  authKey,
}) => {
  try {
    const channelsSets = new Set(updateNotischannels || []);
    channelsSets.delete(channel?.toLowerCase());

    setUpdateNotischannels([...channelsSets]);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/updatechannels`, {
        username: username,
        authkey: authKey,
        channels: [...channelsSets],
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.log(e.message);
  }
};

/**
 * @param {String} channel - channel name
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Number} [size=24] - size of the Icons/Svgs;
 */

const AddUpdateNotificationsButton = ({
  channel,
  loweropacity,
  marginright,
  size = 24,
  show = true,
}) => {
  const { updateNotischannels, setUpdateNotischannels } = useContext(VodsContext);
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const updateNotificationEnabled = updateNotischannels?.includes(channel?.toLowerCase());

  const vodButton = useRef();

  useEventListenerMemo('mouseenter', handleMouseOver, vodButton.current);
  useEventListenerMemo('mouseleave', handleMouseOut, vodButton.current);

  async function addChannel() {
    try {
      const existing = new Set(updateNotischannels || []);
      const newChannels = [...existing.add(channel?.toLowerCase())];

      setUpdateNotischannels(newChannels);
      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/updatechannels`, {
          username: username,
          authkey: authKey,
          channels: newChannels,
        })
        .catch((error) => console.error(error));
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

  if (!show) return null;

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      width='max-content'
      tooltip={`${
        updateNotificationEnabled ? 'Disable' : 'Enable'
      }${channel} stream title/game update notification`}
    >
      <VodAddRemoveButton
        className='StreamUpdateNoitificationsButton'
        marginright={marginright}
        ref={vodButton}
        loweropacity={loweropacity}
        vodenabled={updateNotificationEnabled.toString()}
        variant='link'
        onClick={() =>
          updateNotificationEnabled
            ? removeChannel({
                channel,
                updateNotischannels,
                setUpdateNotischannels,
                username,
                authKey,
              })
            : addChannel({ channel, username, authKey })
        }
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
    </ToolTip>
  );
};
export default AddUpdateNotificationsButton;
