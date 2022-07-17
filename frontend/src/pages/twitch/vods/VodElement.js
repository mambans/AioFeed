import { FaRegEye } from 'react-icons/fa';
import moment from 'moment';
import Moment from 'react-moment';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

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

const VodElement = ({
  data,
  vodBtnDisabled,
  setDragSelected,
  listName,
  list,
  active,
  setPlayQueue,
  playQueue,
  size,
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
  } = data;
  const imgRef = useRef();
  const ref = useRef();

  const onDragStart = (e) => {
    if (setDragSelected) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', id);

      setDragSelected({ data: data, element: ref.current });
    }
  };

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

        {thumbnail_url === '' && (
          <VodLiveIndicator to={`/${login || user_login || user_name}`}>Live</VodLiveIndicator>
        )}
        <Link
          to={{
            pathname: `/${login || user_login || user_name}/videos/${id}${
              listName ? `?list=${listName}` : ''
            }`,
            state: {
              p_title: title,
            },
          }}
          className='imgLink'
        >
          <img
            src={
              thumbnail_url
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
        <VideoTitleHref href={url}>{truncate(title || '', 70)}</VideoTitleHref>
      </ToolTip>

      <ChannelContainer>
        <Link
          className={'profileImg'}
          to={{
            pathname: `/${login || user_login || user_name?.toLowerCase()}/page`,
            state: {
              p_id: user_id,
            },
          }}
        >
          <img src={profile_image_url} alt='' />
        </Link>
        <ChannelNameDiv>
          <Link
            to={{
              pathname: `/${login || user_login || user_name?.toLowerCase()}/page`,
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
export default VodElement;
