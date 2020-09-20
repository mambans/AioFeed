import React from 'react';
import Moment from 'react-moment';
import { FaRegEye } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa';
import styled from 'styled-components';
import { formatViewerNumbers } from '../TwitchUtils';

const Container = styled.div`
  color: rgb(200, 200, 200);
  width: 450px;
  transition: color 250ms;

  img {
    width: 100%;
    border-radius: 0 0 10px 10px;
  }

  svg {
    color: #ffffff;
    fill: #ffffff;
    margin-right: 5px;
  }

  #title {
    text-align: center;
    padding: 5px;

    img#game {
      width: 26px;
      padding: 3px;
    }
  }

  #bottom {
    bottom: 0;
    display: flex;
    justify-content: space-between;
    height: 25px;

    position: absolute;
    width: 100%;
    padding: 0 10px;
    position: absolute;
    margin-bottom: 5px;

    div {
      border-radius: 12.5px;
      background: #161616b0;
      padding: 0 10px;
    }
  }
`;

export default ({ channel }) => {
  return (
    <Container>
      <div id='title'>
        <div>{channel?.title}</div>
        <div>
          <img
            id='game'
            src={channel?.game_img?.replace('{width}', 130)?.replace('{height}', 173)}
            alt=''
          />
          {channel?.game_name}
        </div>
      </div>
      <img
        src={
          channel?.thumbnail_url?.replace('{width}', 1280)?.replace('{height}', 720) +
          `#` +
          Date.now()
        }
        alt=''
      />
      <div id='bottom'>
        <div>
          <FaRegClock size={9} />
          <Moment interval={1} className={'duration'} durationFromNow>
            {channel?.started_at}
          </Moment>
        </div>
        <div>
          <FaRegEye size={9} />
          {formatViewerNumbers(channel?.viewer_count)}
        </div>
      </div>
    </Container>
  );
};
