import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { FaTwitch } from 'react-icons/fa';
import { MdVideocam } from 'react-icons/md';

import { PlayerNavbar } from './StyledComponents';
import { Button } from 'react-bootstrap';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import API from '../API';

export default ({ type, channelName, streamInfo, twitchVideoPlayer, setVisible, visible }) => {
  const [latestVod, setLatestVod] = useState();

  useEffect(() => {
    (async () => {
      if (
        type === 'live' &&
        twitchVideoPlayer &&
        twitchVideoPlayer.getChannelId() &&
        !latestVod &&
        visible
      ) {
        await API.getVideos({
          params: {
            user_id: twitchVideoPlayer.getChannelId(),
            first: 1,
            type: 'archive',
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
  }, [twitchVideoPlayer, visible, type, latestVod, setLatestVod]);

  return (
    <PlayerNavbar>
      {/* <NavigateBack onClick={() => navigate(-1)} variant='dark' title='Go back'>
        <MdArrowBack size={25} />
        Go back
      </NavigateBack> */}
      <Button
        title={`${channelName || (streamInfo && streamInfo.user_name)}'s channel page`}
        variant='dark'
        as={Link}
        to={{
          pathname: `/${channelName || (streamInfo && streamInfo.user_name)}/channel`,
          state: {
            p_channelInfos: streamInfo,
            p_id: twitchVideoPlayer ? twitchVideoPlayer.getChannelId() : null,
          },
        }}
      >
        <MdAccountCircle size={26} />
        {/* {channelName || (streamInfo && streamInfo.user_name)}'s channel page */}
        Channel page
      </Button>
      {streamInfo && (
        <FollowUnfollowBtn
          channel={channelName || (streamInfo && streamInfo.user_name)}
          id={streamInfo && streamInfo.user_id}
          style={{ opacity: '1' }}
        />
      )}
      <Button
        disabled={!latestVod}
        variant='dark'
        as={Link}
        onClick={() => {
          setVisible(false);
        }}
        to={
          latestVod
            ? {
                pathname: `/${latestVod.user_name}/videos/${latestVod.id}`,
                state: {
                  p_title: latestVod.title,
                  p_channel: latestVod.user_name,
                },
              }
            : {
                pathname: `https://twitch.tv/${
                  streamInfo ? streamInfo.user_name : channelName
                }/videos`,
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
        disabled={!latestVod}
        className='linkWithIcon'
        href={
          latestVod
            ? latestVod.url
            : `https://twitch.tv/${streamInfo ? streamInfo.user_name : channelName}/videos`
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
