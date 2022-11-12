import { FaRegEye } from 'react-icons/fa';
import moment from 'moment';
import Moment from 'react-moment';
import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  VideoContainer,
  ImageContainer,
  ImgBottomInfo,
  ChannelContainer,
  VideoTitleHref,
} from '../../sharedComponents/sharedStyledComponents';

import { truncate } from '../../../util';
import { VodLiveIndicator, VodType, VodDates } from './StyledComponents';
import VodsFollowUnfollowBtn from './VodsFollowUnfollowBtn';
import { formatViewerNumbers, formatTwitchVodsDuration } from './../TwitchUtils';
import loginNameFormat from '../loginNameFormat';
import { ChannelNameDiv } from '../StyledComponents';
import AddToListButton from '../../myLists/addToListModal/AddToListButton';
import ToolTip from '../../../components/tooltip/ToolTip';
import AddRemoveFromPlayQueueButton from '../../sharedComponents/AddRemoveFromPlayQueueButton';
import RemoveFromCurrentListButton from '../../myLists/addToListModal/RemoveFromCurrentListButton';

const VodElement = React.memo(
  ({
    data,
    vodBtnDisabled,
    setDragSelected,
    listName,
    list,
    active,
    setPlayQueue,
    playQueue,
    size,
    loading,
    ...props
  }) => {
    const {
      id,
      user_id,
      login,
      user_login,
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
      error,
    } = data;
    const imgRef = useRef();
    const ref = useRef();
    const location = useLocation();

    const onDragStart = (e) => {
      if (setDragSelected) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', id);

        setDragSelected({ data: data, element: ref.current });
      }
    };

    const name = login || user_login || user_name;
    return (
      <VideoContainer draggable={Boolean(setDragSelected)} onDragStart={onDragStart} {...props}>
        <ImageContainer ref={imgRef} active={active}>
          <RemoveFromCurrentListButton videoId_p={id} list={list} />
          <AddToListButton
            videoId_p={id}
            style={{ top: thumbnail_url === '' ? '30px' : '0px' }}
            size={24}
            list={list}
          />
          {setPlayQueue && (
            <AddRemoveFromPlayQueueButton
              videoId={id}
              setPlayQueue={setPlayQueue}
              playQueue={playQueue}
            />
          )}

          {thumbnail_url === '' && <VodLiveIndicator to={`/${name}`}>Live</VodLiveIndicator>}
          <Link
            target={location?.pathname === '/feed' && '_blank'}
            to={{
              pathname: name ? `/${name}/videos/${id}` : `/videos/${id}`,
              search: listName ? `?list=${listName}` : '',
              state: {
                p_title: title,
              },
            }}
            className='imgLink'
          >
            <img
              src={
                error
                  ? `${process.env.PUBLIC_URL}/images/twitch-not-found.png`
                  : thumbnail_url === ''
                  ? `${process.env.PUBLIC_URL}/images/twitch-live.jpg`
                  : thumbnail_url
                      ?.replace('%{width}', size === 'small' ? 339 : 858)
                      ?.replace('%{height}', size === 'small' ? 192 : 480) ||
                    'https://vod-secure.twitch.tv/_404/404_processing_320x180.png'
              }
              alt=''
            />
          </Link>

          <ImgBottomInfo>
            <div title='duration'>
              {thumbnail_url === '' ? (
                <Moment durationFromNow>{created_at}</Moment>
              ) : (
                formatTwitchVodsDuration(duration)
              )}
            </div>
            <span className={'view_count'} title='views'>
              {formatViewerNumbers(view_count)}
              <FaRegEye size={10} />
            </span>
          </ImgBottomInfo>
          {type !== 'archive' && <VodType>{type}</VodType>}
        </ImageContainer>
        <ToolTip show={title?.length > 50} tooltip={title} fontSize={'16px'}>
          <VideoTitleHref error={!!error} href={url || `https://twitch.tv/videos/${id}`}>
            {truncate(title || error || '', 70)}
          </VideoTitleHref>
        </ToolTip>

        <ChannelContainer>
          <Link
            target={location?.pathname === '/feed' && '_blank'}
            className={'profileImg'}
            to={{
              pathname: `/${name?.toLowerCase()}/page`,
              state: {
                p_id: user_id,
              },
            }}
          >
            <img src={profile_image_url} alt='' />
          </Link>
          <ChannelNameDiv>
            <Link
              target={location?.pathname === '/feed' && '_blank'}
              to={{
                pathname: `/${name?.toLowerCase()}/page`,
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
              channel={data}
              loweropacity='0.5'
              className='extaButton'
            />
          </ChannelNameDiv>
          {created_at && (
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
          )}
        </ChannelContainer>
      </VideoContainer>
    );
  }
);
export default VodElement;
