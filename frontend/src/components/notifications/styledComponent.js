import React from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
import moment from 'moment';
import { NotificationBoxStyle } from '../sharedComponents/sharedStyledComponents';

export const NotificationListContainer = styled.div`
  max-height: 600px;
  min-width: 400px;
  /* overflow-y: scroll; */
  margin-top: 20px;
  padding-right: 10px;
  /* width: 400px; */

  ul {
    padding: 0;
  }
`;

export const Notification = styled.li`
  &&& {
    ${NotificationBoxStyle}
    display: grid;
    min-height: 80px;
    height: 80px;
  }

  grid-template-areas: 'img name name' 'img title title' 'date date date';
  grid-template-columns: 15% 85%;
  /* opacity: ${({ status }) =>
    status === 'Offline' ? 0.35 : status?.includes('updated') ? 0.75 : 1}; */
  margin: 7px 0;
  transition: background 250ms, border 250ms, opacity 250ms;
  padding-left: 2px;

  a,
  p,
  div {
    transition: color 250ms, font-weight 250ms;
  }

  &:hover {
    opacity: 1;
    box-shadow: rgba(0, 0, 0, 0.5) 4px 8px 15px;

    a,
    p,
    div {
      color: white;
    }
  }

  * {
    outline-color: transparent;
  }

  .textContainer {
    height: 80px;
    display: grid;
    grid-template-rows: 22% 56% 22%;
    align-items: center;
  }

  .profileImg {
    grid-area: img;
    display: flex;
    align-items: center;

    img {
      width: 46px;
      border-radius: 23px;
      grid-area: img;
      height: 46px;
      object-fit: cover;
    }
  }

  .name {
    color: rgb(240, 240, 240);
    grid-row: 1;
    padding-top: ${({ type }) => (type === 'Offline' ? '15px' : null)};
    padding-left: 3px;
    max-width: 310px;
  }

  .title {
    color: #c1c1c1;
    grid-row: 2;
  }

  .UpdateText {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 310px;
  }
`;

export const UnseenNotifcationCount = styled.div`
  background-color: rgb(170, 0, 0);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 20px;
  line-height: 24px;
  text-align: center;
`;

const StyledDate = styled.div`
  /* color: ${({ status }) => (status === 'Offline' ? '#ffffff' : '#838181')}; */
  color: #838181;
  font-size: 0.85rem;
  text-align: right;
  margin: 0;
  /* grid-row: 3; */
  /* justify-self: right; */
  display: flex;
  justify-content: end;
  position: absolute;
  right: 5px;
  bottom: 5px;

  p {
    margin: 0;
  }

  & > div {
    height: 20px;
    position: relative;
    min-width: 150px;

    * {
      position: absolute;
      top: 0;
      right: 0;
      transition: opacity 250ms;
    }
  }

  & > div:hover {
    #timeago {
      /* display: none; */
      opacity: 0;
    }

    #time {
      /* display: inline; */
      opacity: 1;
    }
  }

  #time {
    /* display: none; */
    opacity: 0;
  }
`;

export const Date = ({ date, status }) => (
  <StyledDate status={status}>
    <div>
      <Moment fromNow id='timeago'>
        {date}
      </Moment>
      <p id='time'>{moment(date).format('MM-DD HH:mm')}</p>
    </div>
  </StyledDate>
);
