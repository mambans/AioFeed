import React, { useEffect, useState, useContext } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { FollowBtn, UnfollowBtn } from './StyledComponents';
import AccountContext from './../account/AccountContext';
import API from './API';
import useToken from './useToken';

export default ({
  channelName,
  id,
  size,
  style,
  refreshStreams,
  refreshAfterUnfollowTimer,
  followingStatus = null,
  show = true,
}) => {
  const [following, setFollowing] = useState(followingStatus || false);
  const { twitchUserId } = useContext(AccountContext);
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
            if (refreshStreams) {
              clearTimeout(refreshAfterUnfollowTimer.current);
              refreshAfterUnfollowTimer.current = setTimeout(() => {
                refreshStreams();
              }, 3000);
            }
          }
        })
        .catch((er) => {
          console.error('UnfollowStream -> er', er);
        });
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

    if (show && followingStatus === null) {
      checkFollowing();
    }
  }, [channelName, twitchUserId, id, followingStatus, show, validateToken]);

  if (!show) return null;

  return (
    <OverlayTrigger
      key={channelName + 'followBtnTooltip'}
      placement={'bottom'}
      delay={{ show: 500, hide: 0 }}
      overlay={
        <Tooltip id={`tooltip-${'bottom'}`}>{`${
          following ? `Unfollow ${channelName || id}` : `Follow ${channelName || id}`
        }`}</Tooltip>
      }
    >
      {following ? (
        <UnfollowBtn
          className='StreamFollowBtn'
          size={size || 30}
          style={{ ...style }}
          onClick={() => {
            setFollowing(false);
            UnfollowStream();
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
    </OverlayTrigger>
  );
};
