import { Link } from 'react-router-dom';
import React, { useContext } from 'react';

import { Notification, Date, NotificationListContainer } from './styledComponent';
import { truncate } from '../../util';
import NotificationsContext from './../notifications/NotificationsContext';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

//deconstruct nested params
const NotificationTwitchItem = ({
  data: { notiStatus, user_name, profile_image_url, text, title, date },
}) => (
  <Notification status={notiStatus}>
    <Link to={`/${user_name?.toLowerCase()}/page`} className='profileImg' alt=''>
      <img src={profile_image_url} alt=''></img>
    </Link>
    <div className='textContainer'>
      <Link to={`/${user_name?.toLowerCase()}/page`} className='name'>
        <b>{user_name}</b> {notiStatus}
      </Link>
      <Link to={`/${user_name?.toLowerCase()}/page`} className='title'>
        {(notiStatus?.includes('updated') &&
          text?.split('\n').map((line) => (
            <p className='UpdateText' key={line}>
              {line}
            </p>
          ))) ||
          truncate(title, 30)}
      </Link>
      <Date date={date} status={notiStatus} />
    </div>
  </Notification>
);

const NotificationsList = () => {
  const { clearNotifications, notifications } = useContext(NotificationsContext);
  useLockBodyScroll(true);

  return (
    <NotificationListContainer>
      <div id='clear' onClick={clearNotifications}>
        Clear all ({notifications?.length || 0})
      </div>
      <ul>
        {notifications?.map((data, index) => (
          <NotificationTwitchItem data={data} key={String(index)} />
        ))}
      </ul>
    </NotificationListContainer>
  );
};

export default NotificationsList;
