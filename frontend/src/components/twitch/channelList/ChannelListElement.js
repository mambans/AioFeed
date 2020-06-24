import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';

import FollowUnfollowBtn from './../FollowUnfollowBtn';
import VodsFollowUnfollowBtn from '../vods/VodsFollowUnfollowBtn';
import { ChannelListLi } from './StyledComponents';
import AddUpdateNotificationsButton from './../AddUpdateNotificationsButton';
import API from '../API';

export default ({
  data,
  selected,
  showVodBtn = true,
  searchInput,
  followingStatus = true,
  style,
}) => {
  const [channel, setChannel] = useState(data);
  const timer = useRef();

  useEffect(() => {
    if (data) {
      setChannel(data);
    } else if (searchInput) {
      timer.current = setTimeout(async () => {
        const data = await API.getUser({ params: { login: searchInput } }).then(
          (res) => res?.data?.data[0],
        );
        if (data) {
          setChannel({
            user_name: data.display_name,
            user_id: data.id,
            profile_img_url: data.profile_image_url,
          });
        }
      }, 1500);
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
      searchInput={searchInput}
      style={{ ...style }}
    >
      <Link
        to={{
          pathname: `/${channel?.user_name || searchInput?.toLowerCase()}/channel/`,
          state: {
            p_id: channel?.user_id,
            p_logo: channel?.profile_img_url,
          },
        }}
      >
        {channel?.profile_img_url ? (
          <img src={channel?.profile_img_url} alt='' />
        ) : (
          <img src={`${process.env.PUBLIC_URL}/images/placeholder.webp`} alt='' />
        )}
        {channel?.user_name || `${searchInput}..`}
      </Link>
      <div className='ButtonContianer'>
        {showVodBtn && <VodsFollowUnfollowBtn channel={channel?.user_name || searchInput} />}
        <AddUpdateNotificationsButton channel={channel?.user_name || searchInput} />
        <FollowUnfollowBtn
          style={{ marginLeft: '5px', marginRight: '0px', padding: '0' }}
          size={22}
          channelName={channel?.user_name || searchInput}
          id={channel?.user_id}
          followingStatus={followingStatus}
        />
      </div>
    </ChannelListLi>
  );
};
