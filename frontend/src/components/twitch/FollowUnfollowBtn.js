import React, { useEffect, useState, useContext } from "react";

import { FollowBtn, UnfollowBtn } from "./StyledComponents";
import AccountContext from "./../account/AccountContext";
import validateToken from "./validateToken";
import API from "./API";

export default ({
  channelName,
  id,
  alreadyFollowedStatus,
  size,
  style,
  refreshStreams,
  refreshAfterUnfollowTimer,
}) => {
  const [following, setFollowing] = useState(alreadyFollowedStatus || false);
  const { twitchUserId } = useContext(AccountContext);

  const UnfollowStream = async () => {
    await validateToken().then(async () => {
      await API.deleteFollow({
        params: {
          myId: twitchUserId,
          id: id,
        },
      })
        .then(() => {
          console.log(`Unfollowed: ${channelName}`);
          if (refreshStreams) {
            clearTimeout(refreshAfterUnfollowTimer.current);
            refreshAfterUnfollowTimer.current = setTimeout(() => {
              refreshStreams();
            }, 3000);
          }
        })
        .catch((er) => {
          console.error("UnfollowStream -> er", er);
        });
    });
  };

  async function followStream() {
    await validateToken().then(async () => {
      await API.addFollow({ params: { myId: twitchUserId, id: id } })
        .then((res) => {
          console.log(`Followed: ${res.data.channel.display_name}`);
          if (refreshStreams) refreshStreams();
        })
        .catch((er) => {
          console.error("followStream -> er", er);
        });
    });
  }

  useEffect(() => {
    const checkFollowing = async () => {
      await validateToken().then(async () => {
        await API.checkFollow({ params: { myId: twitchUserId, id: id } })
          .then(() => {
            setFollowing(true);
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.status === 404 &&
              error.response.statusText === "Not Found"
            ) {
              console.log(`Not following ${channelName}`);
              setFollowing(false);
            } else {
              console.error(error);
            }
          });
      });
    };

    if (!alreadyFollowedStatus) {
      checkFollowing();
    }
    // else {
    //   setFollowing(alreadyFollowedStatus);
    // }
  }, [channelName, twitchUserId, id, alreadyFollowedStatus]);

  if (following) {
    return (
      <UnfollowBtn
        className='StreamFollowBtn'
        title={`Unfollow ${channelName || id}`}
        size={size || 30}
        style={{ ...style }}
        onClick={() => {
          setFollowing(false);
          UnfollowStream();
        }}
      />
    );
  } else {
    return (
      <FollowBtn
        className='StreamFollowBtn'
        title={`Follow ${channelName || id}`}
        size={size || 30}
        style={{ ...style }}
        onClick={() => {
          setFollowing(true);
          followStream();
        }}
      />
    );
  }
};
