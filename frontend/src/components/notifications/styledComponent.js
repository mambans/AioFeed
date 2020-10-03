import React from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
import moment from 'moment';

export const NotificationListContainer = styled.ul`
  li#clear {
    cursor: pointer;
    display: flex;
    justify-content: center;
    font-weight: bold;
    height: 35px;
    align-items: center;
    color: rgb(150, 150, 150);
    transition: color 250ms;

    &:hover {
      color: rgb(255, 255, 255);
    }
  }
`;

export const Notification = styled.li`
  &&& {
    display: grid;
    min-height: 80px;
    height: 80px;
  }

  grid-template-areas: 'img name name' 'img title title' 'date date date';
  grid-template-columns: 15% 85%;
  opacity: ${({ status }) =>
    status === 'Offline' ? 0.35 : status?.includes('updated') ? 0.75 : 1};
  margin: 7px 0;
  transition: background 250ms, border 250ms, opacity 250ms;
  padding-left: 2px;
  border-left: 1px solid transparent;

  a,
  p,
  div {
    transition: color 250ms, font-weight 250ms;
  }

  &:hover {
    border-left: 1px solid white;
    opacity: 1;

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
  color: ${({ status }) => (status === 'Offline' ? '#ffffff' : '#838181')};
  font-size: 0.85rem;
  text-align: right;
  margin: 0;
  grid-row: 3;
  justify-self: right;

  p {
    margin: 0;
  }

  & > div {
    height: 20px;
  }

  & > div:hover {
    #timeago {
      display: none;
    }

    #time {
      display: inline;
    }
  }

  #time {
    display: none;
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
