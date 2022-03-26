import { TiFlashOutline } from 'react-icons/ti';
import { TiFlash } from 'react-icons/ti';
import React, { useState, useContext, useEffect } from 'react';

import { VodAddRemoveButton } from '../sharedComponents/sharedStyledComponents';
import ToolTip from '../../components/tooltip/ToolTip';
import API from '../navigation/API';
import { TwitchContext } from './useToken';

export const removeChannel = async ({ channel, updateNotischannels, setUpdateNotischannels }) => {
  try {
    const channelsSets = new Set(updateNotischannels || []);
    if (channelsSets.has(channel?.toLowerCase())) {
      channelsSets.delete(channel?.toLowerCase());
      const newChannels = [...channelsSets];

      setUpdateNotischannels(newChannels);

      await API.addUdateChannels(newChannels);
    }
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
  size = '1.4em',
  show = true,
}) => {
  const { updateNotischannels, setUpdateNotischannels } = useContext(TwitchContext);
  const [enabled, setEnabled] = useState(updateNotischannels?.includes(channel?.toLowerCase()));

  async function addChannel() {
    try {
      const existing = new Set(updateNotischannels || []);
      const newChannels = [...existing.add(channel?.toLowerCase())];

      setUpdateNotischannels(newChannels);

      await API.addUdateChannels(newChannels);
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    setEnabled(updateNotischannels?.includes(channel?.toLowerCase()));
  }, [updateNotischannels, channel]);

  const handleOnClick = () => {
    setEnabled((c) => !c);
    setTimeout(() => {
      if (enabled) {
        // unfollowStream();
        removeChannel({
          channel,
          updateNotischannels,
          setUpdateNotischannels,
        });
      } else {
        addChannel();
      }
    }, 0);
  };

  if (!show) return null;

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      width='max-content'
      tooltip={`${enabled ? 'Disable' : 'Enable'}${channel} stream title/game update notification`}
    >
      <VodAddRemoveButton
        className='StreamUpdateNoitificationsButton'
        marginright={marginright}
        loweropacity={loweropacity}
        vodenabled={String(enabled)}
        variant='link'
        onClick={handleOnClick}
      >
        {enabled ? <TiFlash size={size} color='green' /> : <TiFlashOutline size={size} />}
      </VodAddRemoveButton>
    </ToolTip>
  );
};
export default AddUpdateNotificationsButton;
