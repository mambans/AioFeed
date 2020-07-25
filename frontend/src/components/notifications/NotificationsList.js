import { Link } from 'react-router-dom';
import React, { useContext } from 'react';

import { Notification, Date, NotificationListContainer } from './styledComponent';
import { truncate } from '../../util/Utils';
import NotificationsContext from './../notifications/NotificationsContext';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

export default () => {
  const { clearNotifications, notifications } = useContext(NotificationsContext);
  useLockBodyScroll(true);

  return (
    <NotificationListContainer>
      <li
        id='clear'
        onClick={() => {
          clearNotifications();
        }}
      >
        Clear all ({notifications?.length || 0})
      </li>
      {notifications?.map((item) => {
        return (
          <Notification key={item.key} status={item.notiStatus}>
            <Link to={`/${item.user_name.toLowerCase()}/channel`} className='profileImg' alt=''>
              <img src={item.profile_img_url} alt=''></img>
            </Link>
            <div className='textContainer'>
              <Link to={`/${item.user_name.toLowerCase()}/channel`} className='name'>
                <b>{item.user_name}</b> {item.notiStatus}
              </Link>
              <Link to={`/${item.user_name.toLowerCase()}/channel`} className='title'>
                {(item.notiStatus.includes('updated') &&
                  item?.text?.split('\n').map((line) => {
                    return (
                      <p className='UpdateText' key={line}>
                        {line}
                      </p>
                    );
                  })) ||
                  truncate(item.title, 30)}
              </Link>
              <Date date={item.date} status={item.notiStatus} />
            </div>
          </Notification>
        );
      })}
    </NotificationListContainer>
  );
};
