import { Link } from 'react-router-dom';
import React, { useContext } from 'react';

import { NotificationListContainer } from './styledComponent';
import NotificationsContext from './../notifications/NotificationsContext';
import NotificationItem, { ClearAllNotifications } from './NotificationItem';

//deconstruct nested params
// const NotificationTwitchItem = ({
//   data: { notiStatus, user_name, profile_image_url, text, title, date } = {},
// }) => {}

const NotificationsList = () => {
  const { clearNotifications, notifications } = useContext(NotificationsContext);

  return (
    <NotificationListContainer>
      <ul>
        {notifications?.map(
          (
            { notiStatus, user_name, profile_image_url, text, title, date, onClick } = {},
            index
          ) => {
            return (
              <NotificationItem
                key={String(index)}
                onClick={onClick}
                title={
                  <Link
                    to={`/${user_name?.toLowerCase()}/page`}
                    className='name'
                    style={{ fontSize: '0.85em' }}
                  >
                    <b>{user_name}</b> {notiStatus}
                  </Link>
                }
                text={
                  text?.split('\n').map((line) => (
                    <p className='UpdateText' key={line}>
                      {line}
                    </p>
                  )) || title
                }
                icon={
                  <Link to={`/${user_name?.toLowerCase()}/page`} className='profileImg' alt=''>
                    <img style={{ borderRadius: '50%' }} src={profile_image_url} alt=''></img>
                  </Link>
                }
                date={date}
              />
            );
          }
        )}
        <ClearAllNotifications
          onClick={clearNotifications}
          nr={notifications?.length || 0}
          disabled={!notifications?.length}
        />
      </ul>
    </NotificationListContainer>
  );
};

export default NotificationsList;
