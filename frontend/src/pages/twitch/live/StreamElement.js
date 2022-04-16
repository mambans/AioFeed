import { Link, useLocation } from 'react-router-dom';
import Moment from 'react-moment';
import React, { useRef } from 'react';
import { MdVideocam } from 'react-icons/md';
import { FaRegWindowRestore, FaTwitch } from 'react-icons/fa';

import {
  VideoTitle,
  ImageContainer,
  VideoContainer,
  ChannelContainer,
  GameContainer,
  GamenameAndViewers,
  ImgBottomInfo,
  LatestVodBtn,
  OpenInNewTab,
  StyledNewlyAddedIndicator,
  StyledNewlyAddedIndicatorWrapper,
  StyledNewlyAddedIndicatorPulseRings,
  RelativeContainer,
  TopRightBtnWrapper,
} from './../../sharedComponents/sharedStyledComponents';
import { ChannelNameDiv } from './../StyledComponents';
import StreamHoverIframe from '../StreamHoverIframe.js';
import { truncate } from '../../../util';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import VodsFollowUnfollowBtn from './../vods/VodsFollowUnfollowBtn';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import AnimatedViewCount from './AnimatedViewCount';
import loginNameFormat from './../loginNameFormat';
import ChannelButtonsContainer from './ChannelButtonsContainer';
import ToolTip from '../../../components/tooltip/ToolTip';
import FavoriteStreamBtn from './FavoriteStreamBtn';
import Schedule from '../schedule';

function NewHighlightNoti({ newlyAddedStreams, login, user_login }) {
  if (newlyAddedStreams?.includes((login || user_login)?.toLowerCase())) {
    return (
      <StyledNewlyAddedIndicatorWrapper>
        <RelativeContainer>
          <StyledNewlyAddedIndicatorPulseRings />
          <StyledNewlyAddedIndicator>New</StyledNewlyAddedIndicator>
        </RelativeContainer>
      </StyledNewlyAddedIndicatorWrapper>
    );
  }
  return '';
}

const StreamElement = ({ data = {}, newlyAddedStreams, refresh, refreshAfterUnfollowTimer }) => {
  const location = useLocation();
  const {
    user_id,
    user_name,
    user_login,
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
    user_login,
  };

  return (
    <VideoContainer key={user_id} ref={videoContainerRef}>
      <ImageContainer id={user_id} ref={ref} style={{ marginTop: '5px' }}>
        <NewHighlightNoti
          newlyAddedStreams={newlyAddedStreams}
          login={login}
          user_login={user_login}
        />
        <Link
          className='imgLink'
          to={{
            pathname: '/' + (login || user_login)?.toLowerCase() || user_name,
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
              newlyAddedStreams?.includes(login || user_login)
                ? { boxShadow: 'white 0px 0px 3px 2px' }
                : null
            }
            src={thumbnailUrl + `?${Date.now()}`}
          />
        </Link>

        <TopRightBtnWrapper>
          <ToolTip
            delay={{ show: 1000, hide: 0 }}
            tooltip='Open streams latest vod'
            placement='bottom'
          >
            <LatestVodBtn
              target='_blank'
              href={`/${
                (login || user_login)?.toLowerCase() || user_name
              }/videos/latest?user_id=${user_id}`}
            >
              <MdVideocam color='inherit' size={22} />
            </LatestVodBtn>
          </ToolTip>
          <ToolTip delay={{ show: 1000, hide: 0 }} tooltip='Open in new tab' placement='bottom'>
            <OpenInNewTab
              target='_blank'
              href={`/${(login || user_login)?.toLowerCase() || user_name}`}
            >
              <FaRegWindowRestore color='inherit' size={18} />
            </OpenInNewTab>
          </ToolTip>
        </TopRightBtnWrapper>

        <ImgBottomInfo>
          <Moment interval={1} durationFromNow>
            {started_at}
          </Moment>
        </ImgBottomInfo>
      </ImageContainer>

      <ToolTip show={title?.length > 50} tooltip={title || ''}>
        <VideoTitle
          to={{
            pathname: '/' + (login || user_login)?.toLowerCase() || user_name,
            state: {
              passedChannelData: streamData,
            },
          }}
        >
          {truncate(title || '', 60)}
        </VideoTitle>
      </ToolTip>

      <div style={{ fontSize: '0.95' }}>
        <ChannelContainer ref={refChannel}>
          <Link
            className='profileImg'
            to={{
              pathname: `/${(login || user_login)?.toLowerCase() || user_name}/page`,
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
                pathname: `/${(login || user_login)?.toLowerCase() || user_name}/page`,
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
              <a
                className='twitchRedirect'
                alt=''
                href={`https://www.twitch.tv/${user_name}?redirect=false`}
                style={{ margin: '2px 5px 0px 0px' }}
              >
                <FaTwitch size={20} color='purple' />
              </a>
              <Schedule
                user={login || user_login || user_name}
                user_id={user_id}
                absolute={false}
                btnSize={22}
              />
              <FavoriteStreamBtn channel={login || user_login} />
              <VodsFollowUnfollowBtn channel={data} marginright='5px;' />
              <AddUpdateNotificationsButton channel={streamData} marginright='5px;' />
              <FollowUnfollowBtn
                style={{
                  gridRow: '1',
                  justifySelf: 'right',
                  margin: '0',
                  marginRight: '8px',
                  height: '100%',
                }}
                size={'1.5em'}
                channelName={login || user_login}
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
