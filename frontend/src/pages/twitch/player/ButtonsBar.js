import React from 'react';
import { FaTwitch } from 'react-icons/fa';
import styled from 'styled-components';
import Button from '../../../components/Button';

const ButtonsBar = ({ style, videoId, children, twitchUsername }) => {
  return (
    <Wrapper style={style}>
      {videoId && (
        <Button
          to={`https://twitch.tv/videos/${videoId}`}
          target='_blank'
          variant='darkTransparent '
        >
          <FaTwitch size={24} color='purple' />
        </Button>
      )}
      {twitchUsername && (
        <Button
          to={`https://twitch.tv/${twitchUsername}`}
          target='_blank'
          variant='darkTransparent '
        >
          <FaTwitch size={24} color='purple' />
        </Button>
      )}
      {children}
    </Wrapper>
  );
};
export default ButtonsBar;

const Wrapper = styled.div`
  border-radus: 1rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  box-shadow: ${({ shadowColor = 'rgb(50, 50, 50)' }) => `1px 1px 1px ${shadowColor}`};
`;
