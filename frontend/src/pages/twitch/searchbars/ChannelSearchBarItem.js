import React from 'react';
import { HeartBeat } from '../../../components/HeartBeat';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import ChannelButtonsContainer from '../live/ChannelButtonsContainer';
import FavoriteStreamBtn from '../live/FavoriteStreamBtn';
import loginNameFormat from '../loginNameFormat';
import Schedule from '../schedule';
import VodsFollowUnfollowBtn from '../vods/VodsFollowUnfollowBtn';
import { Item, Profile, ProfileWrapper, Title } from './styledComponents';

const ChannelSearchBarItem = ({ item, className }) => {
  /* eslint-disable no-unused-vars */
  const {
    broadcaster_login,
    display_name,
    game_id,
    game_name,
    thumbnail_url,
    profile_image_url,
    title,
    started_at,
    is_live,
    id,
    login,
    following,
  } = item || {};
  /* eslint-enable no-unused-vars */

  return (
    <Item to={`/${login}`} disabled={!item} className={className}>
      <ProfileWrapper>
        {is_live && <HeartBeat scaleRings={true} scale={1.5} />}
        {profile_image_url && <Profile src={profile_image_url} />}
      </ProfileWrapper>
      <Title>{loginNameFormat(item)}</Title>
      {item && (
        <ChannelButtonsContainer staticOpen={true}>
          <Schedule
            absolute={false}
            user_id={id}
            btnSize={22}
            style={{ padding: 0, marginRight: '5px' }}
          />
          {following && (
            <FavoriteStreamBtn channel={loginNameFormat(item, true)} id={id} show={following} />
          )}{' '}
          <VodsFollowUnfollowBtn show={item} channel={item} />
          {following && <AddUpdateNotificationsButton channel={item} show={following && item} />}
          {/* </div> */}
        </ChannelButtonsContainer>
      )}
    </Item>
  );
};
export default ChannelSearchBarItem;
