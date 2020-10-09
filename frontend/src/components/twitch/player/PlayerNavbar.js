import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { FaTwitch } from 'react-icons/fa';
import { MdVideocam } from 'react-icons/md';

import { PlayerNavbar } from './StyledComponents';
import { Button } from 'react-bootstrap';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import API from '../API';

export default ({ channelName, streamInfo, setVisible, visible }) => {
  const [channelInfo, setChannelInfo] = useState(streamInfo);

  useEffect(() => {
    (async () => {
      if (streamInfo?.user_id && visible) {
        await API.getVideos({
          params: {
            user_id: streamInfo?.user_id,
            first: 1,
            type: 'archive',
          },
        })
          .then((res) => {
            if (res.data.data[0]) setChannelInfo(res.data.data[0]);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })();
  }, [visible, setChannelInfo, streamInfo]);

  return (
    <PlayerNavbar>
      <Button
        disabled={!channelName && !channelInfo?.user_name}
        title={`${channelInfo?.user_name || channelName}'s channel page`}
        variant='dark'
        className='linkWithIcon'
        as={Link}
        to={{
          pathname: `/${channelInfo?.user_name || channelName}/page`,
          state: {
            p_channelInfos: channelInfo,
            p_id: channelInfo?.user_id,
          },
        }}
      >
        <MdAccountCircle size={26} />
        Channel page
      </Button>
      <FollowUnfollowBtn
        show={channelInfo}
        channel={channelInfo?.user_name || channelName}
        id={channelInfo?.user_id}
        style={{ opacity: '1' }}
      />
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
          channelInfo?.url || `https://twitch.tv/${channelInfo?.user_name || channelName}/videos`
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
