import React, { useEffect, useState, useContext } from 'react';

import { FollowBtn, UnfollowBtn } from './StyledComponents';
import AccountContext from './../account/AccountContext';
import API from './API';
import useToken from './useToken';
import ToolTip from '../sharedComponents/ToolTip';
import { removeChannel as remmoveUpdateChannel } from './AddUpdateNotificationsButton';
import VodsContext from './vods/VodsContext';
import UnsubscribeVodsPopupConfirm from './UnsubscribeVodsPopupConfirm';

export default ({
  channelName,
  id,
  size,
  style,
  refreshStreams,
  refreshAfterUnfollowTimer,
  followingStatus,
  show = true,
}) => {
  const [following, setFollowing] = useState(followingStatus);
  const [showUnsubscribeVods, setShowUnsubscribeVods] = useState();
  const { twitchUserId, authKey, username } = useContext(AccountContext);
  const { updateNotischannels, setUpdateNotischannels, channels } = useContext(VodsContext);

  const validateToken = useToken();

  const UnfollowStream = async () => {
    await validateToken().then(async () => {
      await API.deleteFollow({
        params: {
          from_id: twitchUserId,
          to_id: id,
        },
      })
        .then((res) => {
          if (res.status === 204) {
            console.log(`Unfollowed: ${channelName}`);
            remmoveUpdateChannel({
              channel: channelName,
              updateNotischannels,
              setUpdateNotischannels,
              username,
              authKey,
            });
            if (refreshStreams) {
              clearTimeout(refreshAfterUnfollowTimer.current);
              refreshAfterUnfollowTimer.current = setTimeout(() => {
                refreshStreams();
              }, 3000);
            }
          }
        })
        .catch((er) => console.error('UnfollowStream -> er', er));
    });
  };

  async function followStream() {
    await validateToken().then(async () => {
      await API.addFollow({
        params: {
          from_id: twitchUserId,
          to_id: id || (await API.getUser({ params: { login: channelName } })).data.data[0].id,
        },
      })
        .then((res) => {
          if (res.status === 204) {
            console.log(`Followed: ${channelName}`);
            if (refreshStreams) refreshStreams();
          }
        })
        .catch((er) => {
          console.error('followStream -> er', er);
        });
    });
  }

  useEffect(() => {
    const checkFollowing = async () => {
      await validateToken().then(async () => {
        await API.checkFollow({ params: { from_id: twitchUserId, to_id: id } })
          .then((res) => {
            if (res.data.data[0]) {
              setFollowing(true);
            } else {
              console.log(`-Not following ${channelName}`);
            }
          })
          .catch((error) => {
            if (error.response?.data.message === 'Follow not found') {
              console.log(`Not following ${channelName}`);
              setFollowing(false);
            } else {
              console.error(error);
            }
          });
      });
    };

    if (show && followingStatus === undefined) checkFollowing();
  }, [channelName, twitchUserId, id, followingStatus, show, validateToken]);

  if (!show) return null;

  return (
    <ToolTip
      key={channelName + 'followBtnTooltip'}
      placement={'bottom'}
      delay={{ show: 500, hide: 0 }}
      tooltip={`${following ? 'Unfollow' : 'Follow'} ${channelName || id}`}
      width='max-content'
    >
      <>
        {following ? (
          <UnfollowBtn
            className='StreamFollowBtn'
            size={size || 30}
            style={{ ...style }}
            onClick={() => {
              if (!channels?.includes(channelName?.toLowerCase())) {
                setFollowing(false);
                UnfollowStream();
                return;
              }
              setShowUnsubscribeVods(true);
            }}
          />
        ) : (
          <FollowBtn
            className='StreamFollowBtn'
            size={size || 30}
            style={{ ...style }}
            onClick={() => {
              setFollowing(true);
              followStream();
            }}
          />
        )}

        <UnsubscribeVodsPopupConfirm
          show={showUnsubscribeVods}
          setShowUnsubscribeVods={setShowUnsubscribeVods}
          channel={channelName}
          UnfollowStream={UnfollowStream}
        />
      </>
    </ToolTip>
  );
};
