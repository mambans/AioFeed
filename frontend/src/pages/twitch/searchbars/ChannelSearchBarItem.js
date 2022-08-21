import React, { useEffect, useRef } from 'react';
import { HeartBeat } from '../../../components/HeartBeat';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import ChannelButtonsContainer from '../live/ChannelButtonsContainer';
import FavoriteStreamBtn from '../live/FavoriteStreamBtn';
import loginNameFormat from '../loginNameFormat';
import Schedule from '../schedule';
import VodsFollowUnfollowBtn from '../vods/VodsFollowUnfollowBtn';
import { Item, Profile, ProfileWrapper, Title } from './styledComponents';

const ChannelSearchBarItem = React.memo(
  ({ item, className, observer, visible, hideExtraButtons, onSelect }) => {
    /* eslint-disable no-unused-vars */
    const ref = useRef();
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

    useEffect(() => {
      if (observer) {
        const thisItem = ref.current;
        observer.observe(thisItem);

        return () => {
          observer.unobserve(thisItem);
        };
      }
    }, [observer]);

    return (
      <Item
        ref={ref}
        to={`/${login}`}
        disabled={!item}
        className={className + visible ? ' visible' : ''}
        onClick={(e) => {
          if (onSelect) {
            e.preventDefault();
            e.stopPropagation();
            onSelect(loginNameFormat(item, true));
          }
        }}
        data-id={id}
      >
        {visible && (
          <>
            <ProfileWrapper>
              {is_live && <HeartBeat scaleRings={true} scale={1.5} />}
              {profile_image_url && <Profile src={profile_image_url} />}
            </ProfileWrapper>
            <Title>{loginNameFormat(item)}</Title>
            {item && !item.isAGame && !hideExtraButtons && (
              <ChannelButtonsContainer
                staticOpen={true}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  e.stopPropagation();
                  return false;
                }}
              >
                <Schedule
                  absolute={false}
                  user_id={id}
                  btnSize={22}
                  style={{ padding: 0, marginRight: '5px' }}
                />
                {following && (
                  <FavoriteStreamBtn
                    channel={loginNameFormat(item, true)}
                    id={id}
                    show={following}
                  />
                )}
                <VodsFollowUnfollowBtn show={item} channel={item} />
                {following && (
                  <AddUpdateNotificationsButton channel={item} show={following && item} />
                )}
                {/* </div> */}
              </ChannelButtonsContainer>
            )}
          </>
        )}
      </Item>
    );
  }
);
export default ChannelSearchBarItem;
