import { MdVideoCall } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import { MdVideocamOff } from 'react-icons/md';
import React, { useState, useContext } from 'react';

import AccountContext from '../../account/AccountContext';
import { VodAddRemoveButton } from '../../sharedComponents/sharedStyledComponents';
import AddVodChannel from './AddVodChannel';
import VodsContext from './VodsContext';
import FetchSingelChannelVods from './FetchSingelChannelVods';
import FeedsContext from '../../feed/FeedsContext';
import ToolTip from '../../../components/tooltip/ToolTip';
import API from '../../navigation/API';

/**
 * @param {String} channel - channel name
 * @param {Number} channelId - user_id name
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Boolean} [show = true] - mount/show button.
 */

const VodsFollowUnfollowBtn = ({
  channel,
  channelId,
  loweropacity,
  marginright,
  className,
  show = true,
  size = '1.4em',
  text,
  type = 'link',
  padding,
  unfollowStream = () => {},
}) => {
  const { vods, setVods, channels, setChannels } = useContext(VodsContext) || {};
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const vodEnabled = channels?.includes(channel?.toLowerCase());
  const { feedVideoSizeProps, enableTwitchVods } = useContext(FeedsContext) || {};

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(null);

  async function removeChannel({ channel, channels, setChannels }) {
    try {
      const vodChannels = new Set(channels || []);

      vodChannels.delete(channel?.toLowerCase());
      setChannels([...vodChannels]);

      const existingVodVideos = vods || { data: [] };
      const newVodVideos = {
        ...existingVodVideos,
        data: existingVodVideos.data
          .filter((video) => video.user_name?.toLowerCase() !== channel?.toLowerCase())
          ?.slice(0, 100),
      };

      setVods(newVodVideos);

      await API.updateVodChannels(vodChannels);
    } catch (e) {
      console.log(e.message);
    }
  }

  if (!show && !enableTwitchVods) return null;

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      tooltip={`${vodEnabled ? 'Disable' : 'Enable'} ${channel} vods`}
      width='max-content'
    >
      <VodAddRemoveButton
        className={`VodButton ${className || ''}`}
        marginright={marginright}
        loweropacity={loweropacity}
        vodenabled={String(vodEnabled)}
        variant={type}
        padding={padding}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (vodEnabled) {
            unfollowStream();
            removeChannel({ channel, channels, setChannels });
          } else {
            AddVodChannel({ channel, channels, setChannels, username, authKey });
            if (channelId) {
              FetchSingelChannelVods({
                channelId,
                setVods,
                amount: 5,
                feedVideoSizeProps,
              });
            }
          }
        }}
      >
        <>
          {vodEnabled ? (
            isHovered ? (
              <MdVideocamOff size={size} color='red' />
            ) : (
              <MdVideocam size={size} color='green' />
            )
          ) : (
            <MdVideoCall size={size} />
          )}
          {text}
        </>
      </VodAddRemoveButton>
    </ToolTip>
  );
};
export default VodsFollowUnfollowBtn;
