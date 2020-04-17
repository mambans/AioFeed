import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import axios from "axios";
import { FaTwitch } from "react-icons/fa";
import { MdVideocam } from "react-icons/md";

import { PlayerNavbar } from "./StyledComponents";
import Util from "../../../util/Util";

export default ({
  type,
  channelName,
  channelInfo,
  viewers,
  uptime,
  twitchPlayer,
  setVisible,
  visible,
}) => {
  const [latestVod, setLatestVod] = useState();

  useEffect(() => {
    (async () => {
      if (
        type === "live" &&
        twitchPlayer.current &&
        twitchPlayer.current.getChannelId() &&
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
              Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
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
  }, [twitchPlayer, visible, type]);

  return (
    <PlayerNavbar>
      <Link
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
      </Link>

      {latestVod ? (
        <>
          <Link
            onClick={() => {
              setVisible(false);
            }}
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
          </Link>
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
        <p className='linkWithIcon' style={{ width: "126px" }} />
      )}
    </PlayerNavbar>
  );
};
