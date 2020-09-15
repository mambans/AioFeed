import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HoverIframe = styled.iframe`
  border: none;
  border-radius: 10px;
  z-index: 1;
  cursor: pointer;
  max-width: 360px;
  position: absolute;
  display: block;
  transform: translate3d(0, 0, 0);
`;

const IframeContainer = styled.div`
  transition: opacity 100ms ease-in 900ms;
  transform: translate3d(0, 0, 0);
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

export default ({ data }) => (
  <IframeContainer>
    <HoverIframe
      // url={`https://player.twitch.tv/?channel=${data.data.user_name}&muted=true`}
      // url={`https://player.twitch.tv/?twitch5=1&channel=${data.data.user_name}&autoplay=true&muted=false&!controls`}
      src={`https://player.twitch.tv/?channel=${
        data?.login?.toLowerCase() || data.user_name
      }&parent=aiofeed.com&autoplay=true&muted=false&!controls`}
      title={(data?.login?.toLowerCase() || data.user_name) + '-iframe'}
      theme='dark'
      id={data.id + '-iframe'}
      width='336px'
      height='189px'
      // display='inline'
      position='absolute'
      loading={'Loading..'}
      allowFullScreen={true}
      frameBorder='0'
    />
    <Link
      to={`/${data?.login?.toLowerCase() || data.user_name}`}
      alt=''
      style={{
        position: 'absolute',
        height: '189px',
        width: '336px',
        zIndex: '10',
        padding: '0',
      }}
    >
      ""
    </Link>
  </IframeContainer>
);
