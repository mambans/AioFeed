import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HoverIframe = styled.iframe`
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: block;
  transform: translate3d(0, 0, 0);
  position: absolute;
  height: 100%;
  width: 100%;
`;

const IframeContainer = styled(Link)`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: block;
  transform: translate3d(0, 0, 0);
  transition: opacity 100ms ease-in 900ms;
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

const StreamHoverIframe = ({ data: { login, user_name, id } }) => (
  <Container>
    <HoverIframe
      src={`https://player.twitch.tv/?channel=${
        login?.toLowerCase() || user_name
      }&parent=aiofeed.com&autoplay=true&muted=false&!controls`}
      title={(login?.toLowerCase() || user_name) + '-iframe'}
      theme='dark'
      id={id + '-iframe'}
      width='336px'
      height='189px'
      position='absolute'
      loading={'Loading..'}
      allowFullScreen={true}
      frameBorder='0'
    />
    <IframeContainer to={`/${login?.toLowerCase() || user_name}`} alt=''></IframeContainer>
  </Container>
);
export default StreamHoverIframe;
