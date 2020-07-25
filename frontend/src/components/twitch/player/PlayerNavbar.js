import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { FaTwitch } from 'react-icons/fa';
import { MdVideocam } from 'react-icons/md';

import { PlayerNavbar } from './StyledComponents';
import { Button } from 'react-bootstrap';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import API from '../API';

export default ({ channelName, streamInfo, twitchVideoPlayer, setVisible, visible }) => {
  const [channelInfo, setChannelInfo] = useState(streamInfo);

  useEffect(() => {
    (async () => {
      if (
        (twitchVideoPlayer?.getChannelId()?.length > 1 ||
          twitchVideoPlayer?.getVideo()?.length > 1) &&
        !channelInfo?.id &&
        !channelInfo?.user_name &&
        visible
      ) {
        await API.getVideos({
          params: {
            user_id: twitchVideoPlayer?.getChannelId(),
            id: twitchVideoPlayer?.getVideo(),
            first: 1,
            type: 'archive',
          },
        })
          .then((res) => {
            if (res.data.data[0]) setChannelInfo(res.data.data[0]);
            document.title = `AF | ${res.data.data[0].user_name || ''} - ${
              twitchVideoPlayer?.getVideo() || ''
            }`;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })();
  }, [twitchVideoPlayer, visible, channelInfo, setChannelInfo]);

  return (
    <PlayerNavbar>
      <Button
        disabled={!channelName && !channelInfo?.user_name}
        title={`${channelName || channelInfo?.user_name}'s channel page`}
        variant='dark'
        className='linkWithIcon'
        as={Link}
        to={{
          pathname: `/${channelName || channelInfo?.user_name}/channel`,
          state: {
            p_channelInfos: channelInfo,
            p_id: twitchVideoPlayer?.getChannelId(),
          },
        }}
      >
        <MdAccountCircle size={26} />
        Channel page
      </Button>
      {channelInfo && (
        <FollowUnfollowBtn
          channel={channelName || channelInfo?.user_name}
          id={channelInfo?.user_id}
          style={{ opacity: '1' }}
        />
      )}
      <Button
        disabled={!channelInfo}
        variant='dark'
        as={Link}
        onClick={() => {
          setVisible(false);
        }}
        to={
          channelInfo
            ? {
                pathname: `/${channelInfo.user_name}/videos/${channelInfo.id}`,
                state: {
                  p_title: channelInfo.title,
                  p_channel: channelInfo.user_name,
                },
              }
            : {
                pathname: `https://twitch.tv/${channelInfo?.user_name || channelName}/videos`,
              }
        }
        style={{
          marginRight: '10px',
        }}
        className='linkWithIcon'
      >
        <MdVideocam size={26} />
        Latest Vod
      </Button>
      <a
        disabled={!channelInfo}
        className='linkWithIcon'
        href={
          channelInfo
            ? channelInfo.url
            : `https://twitch.tv/${channelInfo?.user_name || channelName}/videos`
        }
        alt=''
        title='Open vod on Twitch'
        style={{ margin: '0' }}
      >
        <FaTwitch size={26} />
      </a>
    </PlayerNavbar>
  );
};
