import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { FaTwitch } from 'react-icons/fa';

import Moment from 'react-moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React, { useRef, useState, useContext } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import { useLocation } from 'react-router-dom';

import {
  VideoTitle,
  ImageContainer,
  VideoContainer,
  ChannelContainer,
  GameContainer,
} from './../../sharedStyledComponents';
import { ChannelNameDiv } from './../StyledComponents';
import FeedsContext from './../../feed/FeedsContext';
import StreamHoverIframe from '../StreamHoverIframe.js';
import { truncate } from '../../../util/Utils';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import VodsFollowUnfollowBtn from './../vods/VodsFollowUnfollowBtn';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import AnimatedViewCount from './AnimatedViewCount';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import loginNameFormat from './../loginNameFormat';

const HOVER_DELAY = 100;

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

export default ({
  data,
  newlyAddedStreams,
  refresh,
  refreshAfterUnfollowTimer,
  thumbnailRefresh,
}) => {
  const location = useLocation();
  const {
    user_id,
    user_name,
    started_at,
    title,
    game_name,
    viewers,
    thumbnail_url,
    profile_image_url,
    login,
    game_img,
    viewer_count,
  } = data;
  const [isHovered, setIsHovered] = useState(false);
  const { twitchVideoHoverEnable } = useContext(FeedsContext);
  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();

  useEventListenerMemo(
    'mouseenter',
    handleMouseOver,
    ref.current,
    ref.current && twitchVideoHoverEnable
  );
  useEventListenerMemo(
    'mouseleave',
    handleMouseOut,
    ref.current,
    ref.current && twitchVideoHoverEnable
  );

  function handleMouseOver() {
    streamHoverTimer.current = setTimeout(function () {
      setIsHovered(true);
    }, HOVER_DELAY);
  }

  function handleMouseOut() {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
  }

  return (
    <VideoContainer key={user_id}>
      <ImageContainer key={thumbnailRefresh} id={user_id} ref={ref} style={{ marginTop: '5px' }}>
        <NewHighlightNoti newlyAddedStreams={newlyAddedStreams} login={login} />
        {isHovered && <StreamHoverIframe id={user_id} data={data} setIsHovered={setIsHovered} />}
        <Link
          to={{
            pathname: '/' + login?.toLowerCase() || user_name,
            state: {
              p_uptime: started_at,
              p_title: title,
              p_game: game_name,
              p_viewers: viewers,
            },
          }}
        >
          <img
            id={`${user_id}-${Date.now()}`}
            alt='thumbnail'
            style={
              newlyAddedStreams?.includes(login) ? { boxShadow: 'white 0px 0px 3px 2px' } : null
            }
            src={
              thumbnail_url?.replace('{width}', 858)?.replace('{height}', 480) +
                `#` +
                Date.now() +
                thumbnailRefresh || `${process.env.PUBLIC_URL}/images/placeholder.webp`
            }
          />
        </Link>
        <Moment interval={1} className={'duration'} durationFromNow>
          {started_at}
        </Moment>
      </ImageContainer>
      {title?.length > 50 ? (
        <OverlayTrigger
          key={'bottom'}
          placement={'bottom'}
          delay={{ show: 250, hide: 0 }}
          overlay={
            <Tooltip
              id={`tooltip-${'bottom'}`}
              style={{
                width: '336px',
              }}
            >
              {title || ''}
            </Tooltip>
          }
        >
          <VideoTitle
            to={{
              pathname: '/' + login?.toLowerCase() || user_name,
              state: {
                p_uptime: started_at,
                p_title: title,
                p_game: game_name,
                p_viewers: viewers,
              },
            }}
          >
            {truncate(title || '', 60)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: '/' + login?.toLowerCase() || user_name,
            state: {
              p_uptime: started_at,
              p_title: title,
              p_game: game_name,
              p_viewers: viewers,
            },
          }}
        >
          {title || ''}
        </VideoTitle>
      )}
      <div>
        <ChannelContainer ref={refChannel}>
          <Link
            to={{
              pathname: `/${login?.toLowerCase() || user_name}/page`,
              state: {
                p_id: user_id,
              },
            }}
            style={{ gridRow: 1, paddingRight: '5px' }}
          >
            <img src={profile_image_url} alt='' className={'profileImg'} />
          </Link>
          <ChannelNameDiv>
            <Link
              to={{
                pathname: `/${login?.toLowerCase() || user_name}/page`,
                state: {
                  p_id: user_id,
                },
              }}
              className='channelName'
            >
              {loginNameFormat(data)}
            </Link>
            <a
              alt=''
              href={'https://www.twitch.tv/' + login?.toLowerCase() || user_name}
              className='extaButton'
            >
              <FaTwitch size={20} />
            </a>
          </ChannelNameDiv>
          {(location.pathname === '/feed/' || location.pathname === '/feed') && (
            <div className='buttonsContainer'>
              <VodsFollowUnfollowBtn channel={login} marginright='5px;' />
              <AddUpdateNotificationsButton channel={login} marginright='5px;' />
              <FollowUnfollowBtn
                style={{
                  gridRow: '1',
                  justifySelf: 'right',
                  margin: '0',
                  marginRight: '8px',
                  height: '100%',
                }}
                size={22}
                channelName={login}
                id={user_id}
                followingStatus={true}
                refreshStreams={refresh}
                refreshAfterUnfollowTimer={refreshAfterUnfollowTimer}
              />
            </div>
          )}
        </ChannelContainer>

        <GameContainer>
          {game_img && (
            <a className={'gameImg'} href={'https://www.twitch.tv/directory/category/' + game_name}>
              <img
                src={game_img?.replace('{width}', 130)?.replace('{height}', 173)}
                alt=''
                className={'gameImg'}
              />
            </a>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              overflow: 'hidden',
              gridColumn: '2',
            }}
          >
            {game_name ? (
              <Link className={'gameName'} to={'/category/' + game_name}>
                {game_name}
              </Link>
            ) : (
              <div />
            )}

            <AnimatedViewCount viewers={viewer_count} className={'viewers'} disabePrefix={true} />
          </div>
        </GameContainer>
      </div>
    </VideoContainer>
  );
};
