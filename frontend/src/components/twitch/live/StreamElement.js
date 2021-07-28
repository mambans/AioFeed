import { Link, useLocation } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import Moment from 'react-moment';
import React, { useRef } from 'react';

import {
  VideoTitle,
  ImageContainer,
  VideoContainer,
  ChannelContainer,
  GameContainer,
  GamenameAndViewers,
  ImgBottomInfo,
} from './../../sharedComponents/sharedStyledComponents';
import { ChannelNameDiv } from './../StyledComponents';
import StreamHoverIframe from '../StreamHoverIframe.js';
import { truncate } from '../../../util/Utils';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import VodsFollowUnfollowBtn from './../vods/VodsFollowUnfollowBtn';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import AnimatedViewCount from './AnimatedViewCount';
import loginNameFormat from './../loginNameFormat';
import CustomFilters from '../CustomFilters';
import ChannelButtonsContainer from './ChannelButtonsContainer';
import ToolTip from '../../sharedComponents/ToolTip';
import FavoriteStreamBtn from './FavoriteStreamBtn';

function NewHighlightNoti({ newlyAddedStreams, login }) {
  if (newlyAddedStreams?.includes(login?.toLowerCase())) {
    return (
      <FiAlertCircle
        size={22}
        style={{
          position: 'absolute',
          display: 'flex',
          color: 'var(--newHighlightColor)',
          backgroundColor: '#00000042',
          borderRadius: '8px',
          margin: '5px',
        }}
      />
    );
  }
  return '';
}

const StreamElement = ({ data = {}, newlyAddedStreams, refresh, refreshAfterUnfollowTimer }) => {
  const location = useLocation();
  const {
    user_id,
    user_name,
    started_at,
    title,
    game_name,
    thumbnail_url,
    profile_image_url,
    login,
    game_img,
    viewer_count,
  } = data;

  const ref = useRef();
  const refChannel = useRef();
  const videoContainerRef = useRef();
  const thumbnailUrl =
    `${thumbnail_url?.replace('{width}', 858)?.replace('{height}', 480)}` ||
    `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`;

  const streamData = {
    started_at,
    title,
    profile_image_url,
    user_id,
    user_name,
    viewer_count,
    game_name,
    login,
  };

  return (
    <VideoContainer key={user_id} ref={videoContainerRef}>
      <ImageContainer id={user_id} ref={ref} style={{ marginTop: '5px' }}>
        <NewHighlightNoti newlyAddedStreams={newlyAddedStreams} login={login} />
        <Link
          className='imgLink'
          to={{
            pathname: '/' + login?.toLowerCase() || user_name,
            state: {
              passedChannelData: streamData,
            },
          }}
        >
          <StreamHoverIframe id={user_id} data={data} imageRef={ref} />
          <img
            id={`${user_id}-${Date.now()}`}
            // key={`${user_id}-${lastLoaded}`}
            alt=''
            style={
              newlyAddedStreams?.includes(login) ? { boxShadow: 'white 0px 0px 3px 2px' } : null
            }
            src={thumbnailUrl + `?${Date.now()}`}
          />
        </Link>
        <ImgBottomInfo>
          <Moment interval={1} durationFromNow>
            {started_at}
          </Moment>
        </ImgBottomInfo>
      </ImageContainer>

      <ToolTip show={title?.length > 50} tooltip={title || ''}>
        <VideoTitle
          to={{
            pathname: '/' + login?.toLowerCase() || user_name,
            state: {
              passedChannelData: streamData,
            },
          }}
        >
          {truncate(title || '', 60)}
        </VideoTitle>
      </ToolTip>

      <div style={{ overflowX: 'hidden' }}>
        <ChannelContainer ref={refChannel}>
          <Link
            className='profileImg'
            to={{
              pathname: `/${login?.toLowerCase() || user_name}/page`,
              state: {
                passedChannelData: streamData,
              },
            }}
          >
            <img src={profile_image_url} alt='' />
          </Link>
          <ChannelNameDiv>
            <Link
              to={{
                pathname: `/${login?.toLowerCase() || user_name}/page`,
                state: {
                  passedChannelData: streamData,
                },
              }}
              className='channelName'
            >
              {loginNameFormat(data)}
            </Link>
          </ChannelNameDiv>
          {(location.pathname === '/feed/' || location.pathname === '/feed') && (
            <ChannelButtonsContainer className='buttonsContainer'>
              <FavoriteStreamBtn channel={login} />
              <CustomFilters
                channel={login?.toLowerCase() || user_name}
                enableFormControll={true}
                videoContainerRef={videoContainerRef}
              />
              <VodsFollowUnfollowBtn channel={login} channelId={user_id} marginright='5px;' />
              <AddUpdateNotificationsButton channel={login} marginright='5px;' />
              <FollowUnfollowBtn
                style={{
                  gridRow: '1',
                  justifySelf: 'right',
                  margin: '0',
                  marginRight: '8px',
                  height: '100%',
                }}
                size={'1.5em'}
                channelName={login}
                id={user_id}
                followingStatus={true}
                refreshStreams={refresh}
                refreshAfterUnfollowTimer={refreshAfterUnfollowTimer}
              />
            </ChannelButtonsContainer>
          )}
        </ChannelContainer>

        <GameContainer>
          <a className={'gameImg'} href={'https://www.twitch.tv/directory/category/' + game_name}>
            <img
              src={game_img?.replace('{width}', 130)?.replace('{height}', 173)}
              alt=''
              className={'gameImg'}
            />
          </a>

          <GamenameAndViewers>
            {game_name ? (
              <Link className={'gameName'} to={'/category/' + game_name}>
                {game_name}
              </Link>
            ) : (
              <div />
            )}

            <AnimatedViewCount viewers={viewer_count} className={'viewers'} disabePrefix={true} />
          </GamenameAndViewers>
        </GameContainer>
      </div>
    </VideoContainer>
  );
};

export default StreamElement;
