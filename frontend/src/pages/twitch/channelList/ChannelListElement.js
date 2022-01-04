import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';

import FollowUnfollowBtn from './../FollowUnfollowBtn';
import VodsFollowUnfollowBtn from '../vods/VodsFollowUnfollowBtn';
import { ChannelListLi } from './StyledComponents';
import AddUpdateNotificationsButton from './../AddUpdateNotificationsButton';
import TwitchAPI from '../API';
import LiveIndicator from './LiveIndicator';
import AddVideoExtraData from '../AddVideoExtraData';
import loginNameFormat from '../loginNameFormat';
import CustomFilters from '../CustomFilters';
import ChannelButtonsContainer from '../live/ChannelButtonsContainer';
import FavoriteStreamBtn from '../live/FavoriteStreamBtn';
import Schedule from '../schedule';

const ChannelListElement = ({
  data,
  selected,
  showVodBtn = true,
  searchInput,
  followingStatus = true,
  style,
  username,
}) => {
  const [channel, setChannel] = useState(data);
  const timer = useRef();

  useEffect(() => {
    if (data) {
      setChannel(data);
    } else if (searchInput) {
      timer.current = setTimeout(async () => {
        const data = await TwitchAPI.getUser({ login: searchInput }).then(
          (res) => res?.data?.data[0]
        );

        const liveInfo = await TwitchAPI.getStreams({ user_login: searchInput }).then(
          (res) => res?.data?.data[0]
        );

        const finalLiveInfo = liveInfo
          ? await AddVideoExtraData({
              items: { data: [liveInfo] },
              fetchGameInfo: true,
              saveNewProfiles: false,
            }).then((res) => res?.data[0])
          : {};

        if (data) {
          setChannel({
            user_name: data.display_name,
            user_id: data.id,
            ...finalLiveInfo,
            profile_image_url: data.profile_img_url,
            live: liveInfo && liveInfo?.type === 'live',
          });
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [data, searchInput]);

  return (
    <ChannelListLi
      key={channel?.user_id || searchInput}
      className={selected ? 'selected' : ''}
      selected={selected}
      live={channel?.live || (channel?.is_live && channel?.started_at !== '')}
      style={{ ...style }}
    >
      <Link
        to={{
          pathname: `/${
            `${channel?.login || channel?.user_name}${!channel?.live ? '/page' : ''}` ||
            `${searchInput?.toLowerCase()}${!channel?.live ? '/page' : ''}`
          }`,
          state: {
            p_id: channel?.user_id,
            p_logo: channel?.profile_image_url,
          },
        }}
      >
        {channel?.live || (channel?.is_live && channel?.started_at !== '') ? (
          <LiveIndicator channel={channel} />
        ) : (
          <img
            src={
              channel?.profile_image_url || `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`
            }
            alt=''
          />
        )}
        {loginNameFormat(channel) || `${searchInput}..`}
      </Link>
      {/* <div className='ButtonContianer'> */}
      <ChannelButtonsContainer staticOpen={true}>
        <Schedule
          absolute={false}
          user={channel?.user_name || searchInput}
          user_id={channel?.user_id}
          btnSize={22}
        />
        <FavoriteStreamBtn channel={channel?.user_name} show={followingStatus} />
        <CustomFilters
          channel={channel?.user_name.toLowerCase()}
          show={followingStatus}
          style={{ margin: '0' }}
        />
        <VodsFollowUnfollowBtn
          show={username && showVodBtn}
          channel={channel?.user_name || searchInput}
          channelId={channel?.user_id}
        />
        <AddUpdateNotificationsButton
          channel={channel?.user_name || searchInput}
          show={followingStatus}
        />
        <FollowUnfollowBtn
          style={{ marginLeft: '5px', marginRight: '0px', padding: '0' }}
          size={22}
          channelName={channel?.user_name || searchInput}
          id={channel?.user_id}
          followingStatus={followingStatus}
        />
        {/* </div> */}
      </ChannelButtonsContainer>
    </ChannelListLi>
  );
};
export default ChannelListElement;