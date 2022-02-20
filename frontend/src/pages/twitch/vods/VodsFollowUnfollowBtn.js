import { MdVideoCall } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import { MdVideocamOff } from 'react-icons/md';
import React, { useState, useContext } from 'react';

import AccountContext from '../../account/AccountContext';
import { VodAddRemoveButton } from '../../sharedComponents/sharedStyledComponents';
import VodsContext from './VodsContext';
import FetchSingelChannelVods from './FetchSingelChannelVods';
import FeedsContext from '../../feed/FeedsContext';
import ToolTip from '../../../components/tooltip/ToolTip';
import useVodChannel from './useVodChannel';

/**
 * @param {Object} channel - channel
 * @param {String} [loweropacity] - overwrite opacity (0.5)
 * @param {String} [marginright] - overwrite marginright (7px;)
 * @param {Boolean} [show = true] - mount/show button.
 */

const VodsFollowUnfollowBtn = ({
  channel,
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
  const { setVods, channels, setChannels } = useContext(VodsContext) || {};
  const { authKey, username } = useContext(AccountContext);
  const [isHovered, setIsHovered] = useState();
  const { enableTwitchVods } = useContext(FeedsContext) || {};
  const { removeChannel, addVodChannel } = useVodChannel();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(null);

  if ((!show && !enableTwitchVods) || !channel) return null;

  const vodEnabled = channels?.find((user_id) => channel?.user_id === user_id);

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      tooltip={`${vodEnabled ? 'Disable' : 'Enable'} ${channel?.user_name} vods`}
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
            addVodChannel({ channel, channels, setChannels, username, authKey });
            if (channel?.user_id) {
              FetchSingelChannelVods({
                user_id: channel.user_id,
                setVods,
                amount: 5,
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
