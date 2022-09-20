import { MdVideoCall } from 'react-icons/md';
import { MdVideocam } from 'react-icons/md';
import React, { useState, useEffect } from 'react';

import { VodAddRemoveButton } from '../../sharedComponents/sharedStyledComponents';
import ToolTip from '../../../components/tooltip/ToolTip';
import useVodChannel from './hooks/useVodChannel';
import useFetchSingelVod from './hooks/useFetchSingelVod';
import loginNameFormat from '../loginNameFormat';
import { useRecoilValue } from 'recoil';
import { vodChannelsAtom } from './atoms';
import { feedPreferencesAtom } from '../../../atoms/atoms';

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
}) => {
  const channels = useRecoilValue(vodChannelsAtom);
  const [enabled, setEnabled] = useState(
    channels && !!channels?.find((user_id) => channel?.user_id === user_id)
  );
  const { vods } = useRecoilValue(feedPreferencesAtom) || {};

  const { removeChannel, addVodChannel } = useVodChannel() || {};
  const { fetchLatestVod } = useFetchSingelVod() || {};

  const handleOnClick = (e) => {
    e.preventDefault();
    setEnabled((c) => !c);
    setTimeout(() => {
      if (enabled) {
        // unfollowStream();
        if (removeChannel) removeChannel({ channel });
      } else {
        if (addVodChannel) addVodChannel({ channel });
        if (channel?.user_id) {
          fetchLatestVod({ user_id: channel.user_id, amount: 5 });
        }
      }
    }, 0);
  };

  useEffect(() => {
    setEnabled(!!channels?.find((user_id) => channel?.user_id === user_id));
  }, [channels, channel?.user_id]);

  if ((!show && !vods?.enabled) || !channel) return null;

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      tooltip={`${enabled ? 'Disable' : 'Enable'} ${loginNameFormat(channel)} vods`}
      width='max-content'
    >
      <VodAddRemoveButton
        className={`VodButton ${className || ''}`}
        marginright={marginright}
        loweropacity={loweropacity}
        vodenabled={String(enabled)}
        variant={type}
        padding={padding}
        onClick={handleOnClick}
      >
        <>
          {enabled ? <MdVideocam size={size} /> : <MdVideoCall size={size} />}
          {text}
        </>
      </VodAddRemoveButton>
    </ToolTip>
  );
};
export default VodsFollowUnfollowBtn;
