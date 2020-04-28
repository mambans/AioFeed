import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import axios from "axios";
import { FaTwitch } from "react-icons/fa";
import { MdVideocam } from "react-icons/md";
import { MdArrowBack } from "react-icons/md";

import { PlayerNavbar, NavigateBack } from "./StyledComponents";
import { getCookie } from "../../../util/Utils";
import { Button } from "react-bootstrap";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";

export default ({
  type,
  channelName,
  channelInfo,
  viewers,
  uptime,
  twitchPlayer,
  setVisible,
  visible,
  setLatestVod,
  latestVod,
  showUIControlls,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (
        type === "live" &&
        twitchPlayer.current &&
        twitchPlayer.current.getChannelId() &&
        !latestVod &&
        visible
      ) {
        await axios
          .get(`https://api.twitch.tv/helix/videos?`, {
            params: {
              user_id: twitchPlayer.current && twitchPlayer.current.getChannelId(),
              first: 1,
              type: "archive",
            },
            headers: {
              Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            },
          })
          .then((res) => {
            setLatestVod(res.data.data[0]);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })();
  }, [twitchPlayer, visible, type, latestVod, setLatestVod]);

  return (
    <PlayerNavbar>
      <NavigateBack onClick={() => navigate(-1)} variant='dark' title='Go back'>
        <MdArrowBack size={25} />
        Go back
      </NavigateBack>
      <Button
        variant='dark'
        as={Link}
        to={{
          pathname: `/${channelName || (channelInfo && channelInfo.display_name)}/channel`,
          state: {
            p_channelInfos: channelInfo,
            p_viewers: viewers,
            p_uptime: uptime,
            p_id: twitchPlayer.current ? twitchPlayer.current.getChannelId() : null,
          },
        }}>
        <MdAccountCircle size={26} />
        {channelName || (channelInfo && channelInfo.display_name)}'s channel page
      </Button>
      {channelInfo && !showUIControlls && (
        <FollowUnfollowBtn
          channel={channelName || (channelInfo && channelInfo.display_name)}
          id={channelInfo && channelInfo._id}
          style={{ opacity: "1" }}
        />
      )}

      {latestVod ? (
        <>
          <Button
            variant='dark'
            as={Link}
            onClick={() => {
              setVisible(false);
            }}
            style={{ marginRight: "10px" }}
            className='linkWithIcon'
            to={{
              pathname: `/${latestVod.user_name}/video/${latestVod.id}`,
              state: {
                p_title: latestVod.title,
                p_channel: latestVod.user_name,
              },
            }}>
            <MdVideocam size={26} />
            Latest Vod
          </Button>
          <a
            className='linkWithIcon'
            href={latestVod.url}
            alt=''
            title='Open vod on Twitch'
            style={{ margin: "0" }}>
            <FaTwitch size={26} />
          </a>
        </>
      ) : (
        <div style={{ width: "174.75px" }}></div>
      )}
    </PlayerNavbar>
  );
};
