import moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import {
  StyledDate,
  StyledClearAllNotifications,
  StyledNotificationItem,
  NotificationIcon,
  NotificationText,
} from '../notifications/styledComponent';

export const DateText = ({ date, status }) => (
  <StyledDate status={status}>
    <div>
      <Moment fromNow id='timeago'>
        {date}
      </Moment>
      <p id='time'>{moment(date).format('MM-DD HH:mm')}</p>
    </div>
  </StyledDate>
);

export const ClearAllNotifications = ({ nr, disabled, onClick, text }) => (
  <StyledClearAllNotifications disabled={disabled} onClick={onClick}>
    {text || `Clear all ${!!nr && `(${nr})`}`}
  </StyledClearAllNotifications>
);

const NotificationItem = ({ title, text, icon, date, iconWidth = '60px' }) => (
  <StyledNotificationItem>
    <NotificationIcon width={iconWidth}>{icon}</NotificationIcon>
    <NotificationText>
      <h1>{title}</h1>
      <span>{text}</span>
    </NotificationText>
    <DateText date={date} />
  </StyledNotificationItem>
);

export default NotificationItem;
