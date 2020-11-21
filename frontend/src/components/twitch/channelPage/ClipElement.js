import { FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React, { useRef } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';

import {
  VideoContainer,
  VideoTitle,
  ImageContainer,
  GameContainer,
  ChannelContainer,
  VodVideoInfo,
} from './../../sharedStyledComponents';
import { truncate } from '../../../util/Utils';
import { formatViewerNumbers } from './../TwitchUtils';
import loginNameFormat from '../loginNameFormat';

export default ({ ...data }) => {
  const { user_name } = data;
  const {
    broadcaster_name,
    broadcaster_id,
    id,
    thumbnail_url,
    view_count,
    title,
    profile_image_url,
    game_name,
    game_img,
    created_at,
    login,
  } = data.data;
  const imgRef = useRef();

  return (
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        <a
          className='imgLink'
          href={`https://www.twitch.tv/${login || user_name || broadcaster_name}/clip/${id}`}
        >
          <img src={thumbnail_url} alt='' />
        </a>
        <VodVideoInfo>
          <p className={'vodDuration'} title='duration'></p>
          <p className={'view_count'} title='views'>
            {formatViewerNumbers(view_count)}
            <FaRegEye size={10} />
          </p>
        </VodVideoInfo>
      </ImageContainer>
      {title?.length > 50 ? (
        <OverlayTrigger
          key={id + 'ClipVideoToolTip'}
          placement={'bottom'}
          delay={{ show: 250, hide: 0 }}
          overlay={
            <Tooltip
              id={`tooltip-${'bottom'}`}
              style={{
                width: '320px',
              }}
            >
              {title || ''}
            </Tooltip>
          }
        >
          <VideoTitle to={`/${login || user_name || broadcaster_name}/clip/${id}`}>
            {truncate(title || '', 70)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle to={`/${login || user_name || broadcaster_name}/clip/${id}`}>
          {title || ''}
        </VideoTitle>
      )}

      <div style={{ width: '336px' }}>
        <ChannelContainer>
          <Link
            className={'profileImg'}
            to={{
              pathname: `/${(login || broadcaster_name)?.toLowerCase()}/page`,
              state: {
                p_id: broadcaster_id,
              },
            }}
          >
            <img src={profile_image_url} alt='' />
          </Link>
          <Link to={`/${(login || broadcaster_name)?.toLowerCase()}/page`} className='channelName'>
            {loginNameFormat(data.data)}
          </Link>
        </ChannelContainer>
        <GameContainer>
          <a className={'gameImg'} href={'https://www.twitch.tv/directory/category/' + game_name}>
            <img
              src={game_img?.replace('{width}', 130)?.replace('{height}', 173)}
              alt=''
              className={'gameImg'}
            />
          </a>
          <Link className={'gameName'} to={'/category/' + game_name}>
            {game_name}
          </Link>
          <Moment
            className='viewers'
            style={{
              gridColumn: 3,
              justifySelf: 'right',
            }}
            fromNow
          >
            {created_at}
          </Moment>
        </GameContainer>
      </div>
    </VideoContainer>
  );
};
