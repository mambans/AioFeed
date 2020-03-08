import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useState, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import { FollowBtn, UnfollowBtn } from "./styledComponents";
import AccountContext from "./../account/AccountContext";
import Utilities from "../../utilities/Utilities";

export default ({ channelName, id, alreadyFollowedStatus, size, style }) => {
  const [following, setFollowing] = useState(false);
  const { setTwitchToken, twitchToken, setRefreshToken, refreshToken, twitchUserId } = useContext(
    AccountContext
  );

  // const myUserId = async () => {
  //   await axios
  //     .get(`https://api.twitch.tv/helix/users?`, {
  //       params: {
  //         login: Utilities.getCookie("Twitch-username"),
  //       },
  //       headers: {
  //         Authorization: `Bearer ${twitchToken}`,
  //         "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
  //       },
  //     })
  //     .then(res => {
  //       console.log("myUserId -> res", res);
  //       return res.data.data[0].id;
  //     })
  //     .catch(async error => {
  //       console.error(error);
  //     });
  // };

  async function UnfollowStream(data) {
    const { user_id, setTwitchToken, twitchToken, setRefreshToken } = data;

    await axios
      .delete(`https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${user_id}`, {
        headers: {
          Authorization: `OAuth ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      })
      .then(() => {
        console.log(`Unfollowed: ${channelName}`);
        // data.refresh();
      })
      .catch(async e => {
        console.error(e);
        console.log("Re-authenticating with Twitch.");

        await axios
          .post(
            `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
              Utilities.getCookie("Twitch-refresh_token")
            )}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${
              process.env.REACT_APP_TWITCH_SECRET
            }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
          )
          .then(async res => {
            setTwitchToken(res.data.access_token);
            setRefreshToken(res.data.refresh_token);
            document.cookie = `Twitch-access_token=${res.data.access_token}; path=/`;
            document.cookie = `Twitch-refresh_token=${res.data.refresh_token}; path=/`;

            await axios
              .delete(
                `https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${user_id}`,
                {
                  headers: {
                    Authorization: `OAuth ${res.data.access_token}`,
                    "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    Accept: "application/vnd.twitchtv.v5+json",
                  },
                }
              )
              .then(() => {
                console.log(`Unfollowed: ${channelName}`);
                // data.refresh();
              });
          });
      });
  }

  const followStream = async UserId => {
    await axios
      .put(`https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${UserId}`, "", {
        headers: {
          Authorization: `OAuth ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      })
      .then(res => {
        console.log("res", res);
        if (res.data) console.log("Started following ", channelName);
      })
      .catch(async error => {
        console.log(`Failed to unfollow . `, error);
        console.log(`Trying to auto re-authenticate with Twitch.`);

        await axios
          .post(
            `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
              refreshToken
            )}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${
              process.env.REACT_APP_TWITCH_SECRET
            }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
          )
          .then(async res => {
            setTwitchToken(res.data.access_token);
            setRefreshToken(res.data.refresh_token);
            document.cookie = `Twitch-access_token=${res.data.access_token}; path=/`;
            document.cookie = `Twitch-refresh_token=${res.data.refresh_token}; path=/`;

            await axios
              .put(
                `https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${UserId}`,
                "",
                {
                  headers: {
                    Authorization: `OAuth ${res.data.access_token}`,
                    "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    Accept: "application/vnd.twitchtv.v5+json",
                  },
                }
              )
              .then(() => {
                console.log(`Followed: `);
                // data.refresh();
              })
              .catch(error => {
                console.error("Followed: ", error);
              });
          })
          .catch(er => {
            console.error(er);
            console.log(`Failed to follow stream : `, er);
            console.log("::Try manually re-authenticate from the sidebar.::");
          });
      });
  };

  useEffect(() => {
    const checkFollowing = async () => {
      await axios
        .get(`https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${id}`, {
          headers: {
            Authorization: `OAuth ${twitchToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        })
        .then(res => {
          setFollowing(true);
        })
        .catch(error => {
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
    };
    if (!alreadyFollowedStatus) {
      checkFollowing();
    } else {
      setFollowing(alreadyFollowedStatus);
    }
  }, [channelName, twitchToken, twitchUserId, id, alreadyFollowedStatus]);

  if (following) {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 300, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${"bottom"}`}>
            Unfollow <strong>{channelName}</strong>.
          </Tooltip>
        }>
        <UnfollowBtn
          // id='FollowUnfollowButton'
          id='IsFollowed'
          size={size || 30}
          style={{ ...style }}
          onClick={() => {
            setFollowing(false);
            UnfollowStream({
              user_id: id,
              setTwitchToken: setTwitchToken,
              twitchToken: twitchToken,
              setRefreshToken: setRefreshToken,
            }).catch(error => {
              console.log(`Failed to unfollow stream ${channelName}: `, error);
              console.log("::Try re-authenticate from the sidebar::");
            });
          }}
        />
      </OverlayTrigger>
    );
  } else {
    return (
      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 500, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${"bottom"}`}>
            Follow <strong>{channelName}</strong>.
          </Tooltip>
        }>
        <FollowBtn
          id='IsNotFollowed'
          size={size || 30}
          style={{ ...style }}
          onClick={() => {
            setFollowing(true);
            followStream(id);
          }}
        />
      </OverlayTrigger>
    );
  }
};
