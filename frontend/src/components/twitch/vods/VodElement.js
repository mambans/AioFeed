import { FaRegEye } from 'react-icons/fa';
import moment from 'moment';
import Moment from 'react-moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React, { useRef, useState } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';

import {
  VideoContainer,
  VideoTitle,
  ImageContainer,
  VodVideoInfo,
  ChannelContainer,
  StyledVideoElementAlert,
  Duration,
} from './../../sharedStyledComponents';
import { truncate } from '../../../util/Utils';
import { VodLiveIndicator, VodType, VodPreview, VodDates } from './StyledComponents';
import VodsFollowUnfollowBtn from './VodsFollowUnfollowBtn';
import { formatViewerNumbers, formatTwitchVodsDuration } from './../TwitchUtils';
import validateToken from '../validateToken';
import API from '../API';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import loginNameFormat from '../loginNameFormat';
import { ChannelNameDiv } from '../StyledComponents';
import AddVideoButton from '../../favorites/AddVideoButton';

export default ({ data, vodBtnDisabled, disableContextProvider }) => {
  const {
    id,
    user_id,
    login,
    user_name,
    url,
    thumbnail_url,
    created_at,
    duration,
    view_count,
    type,
    title,
    endDate,
    profile_image_url,
  } = data;
  const [previewAvailable, setPreviewAvailable] = useState({});
  const [showPreview, setShowPreview] = useState();
  const imgRef = useRef();
  const hoverTimeoutRef = useRef();

  useEventListenerMemo('mouseenter', handleMouseOver, imgRef.current);
  useEventListenerMemo('mouseleave', handleMouseOut, imgRef.current);

  async function handleMouseOver() {
    if (!previewAvailable.data) {
      hoverTimeoutRef.current = setTimeout(
        async () => {
          await validateToken().then(async () => {
            await API.krakenGetVideo({
              params: {
                id: id,
              },
            })
              .then((res) => {
                if (res.data.status === 'recording') {
                  setPreviewAvailable({
                    status: 'recording',
                    error: 'Stream is live - no preview yet',
                  });
                } else {
                  // if (thumbnail_url === '') thumbnail_url = res.data.preview.template;
                  setPreviewAvailable({
                    data: res.data.animated_preview_url,
                  });
                }
                setShowPreview(true);
              })
              .catch((error) => {
                setPreviewAvailable({ error: 'Preview failed' });
                console.error(error);
              });
          });
        },
        previewAvailable.error ? 5000 : 1000
      );
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 250);
    }
  }

  function handleMouseOut() {
    clearTimeout(hoverTimeoutRef.current);
    setShowPreview(false);
  }

  return (
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        <AddVideoButton
          videoId_p={id}
          disablepreview={handleMouseOut}
          disableContextProvider={disableContextProvider}
        />
        {previewAvailable.error && (
          <StyledVideoElementAlert variant='danger' className='error'>
            {previewAvailable.error}
          </StyledVideoElementAlert>
        )}
        {thumbnail_url === '' && !previewAvailable.data && (
          <VodLiveIndicator to={`/${login || user_name}`}>Live</VodLiveIndicator>
        )}
        <a href={url}>
          {previewAvailable.data && showPreview && (
            <VodPreview previewAvailable={previewAvailable.data} className='VodPreview' />
          )}
          <img
            src={
              thumbnail_url?.replace('%{width}', 640)?.replace('%{height}', 360) ||
              'https://vod-secure.twitch.tv/_404/404_processing_320x180.png'
            }
            alt=''
          />
        </a>

        <VodVideoInfo>
          <Duration title='duration'>
            {thumbnail_url === '' && !previewAvailable.data ? (
              <Moment durationFromNow>{created_at}</Moment>
            ) : (
              formatTwitchVodsDuration(duration)
            )}
          </Duration>
          <p className={'view_count'} title='views'>
            {formatViewerNumbers(view_count)}
            <FaRegEye
              size={10}
              style={{
                color: 'rgb(200, 200, 200)',
                marginLeft: '5px',
                marginTop: '3px',
                display: 'flex',
                alignItems: 'center',
              }}
            />
          </p>
        </VodVideoInfo>
        {type !== 'archive' && <VodType>{type}</VodType>}
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
                width: '320px',
              }}
            >
              {title || ''}
            </Tooltip>
          }
        >
          <VideoTitle
            to={{
              pathname: `/${login || user_name}/videos/${id}`,
              state: {
                p_title: title,
              },
            }}
          >
            {truncate(title || '', 70)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle
          to={{
            pathname: `/${login || user_name}/videos/${id}`,
            state: {
              p_title: title,
            },
          }}
        >
          {title || ''}
        </VideoTitle>
      )}
      <ChannelContainer>
        <Link
          to={{
            pathname: `/${login || user_name?.toLowerCase()}/page`,
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
              pathname: `/${login || user_name?.toLowerCase()}/page`,
              state: {
                p_id: user_id,
              },
            }}
            className={'channelName'}
          >
            {loginNameFormat(data)}
          </Link>

          <VodsFollowUnfollowBtn
            show={!vodBtnDisabled}
            channel={login || user_name}
            loweropacity='0.5'
            className='extaButton'
            channelId={user_id}
          />
        </ChannelNameDiv>
        <VodDates>
          <div>
            <Moment interval={300000} durationFromNow className={'date'} id={'timeago'}>
              {thumbnail_url === '' ? created_at : endDate}
            </Moment>
            <p
              id={'time'}
              className='viewers'
              style={{
                gridColumn: 2,
                justifySelf: 'right',
              }}
            >
              {`${moment(created_at).format('dd HH:mm')} → ${
                thumbnail_url === ''
                  ? moment(Date.now()).format('dd HH:mm')
                  : moment(endDate).format('dd HH:mm')
              }`}
            </p>
          </div>
        </VodDates>
      </ChannelContainer>
    </VideoContainer>
  );
};
