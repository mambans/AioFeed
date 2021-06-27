import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import React, { useContext } from 'react';

import NavigationContext from './../../navigation/NavigationContext';
import {
  VideoAndChatContainer,
  StyledVideo,
  PlayerNavbar,
  PlayerExtraButtons,
} from './StyledComponents';
import useFullscreen from '../../../hooks/useFullscreen';

const PlayerClip = () => {
  const { visible } = useContext(NavigationContext);
  const { videoId, channelName } = useParams();
  document.title = `${channelName} - ${videoId}`;
  useFullscreen({ hideNavbar: false });

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-250ms' unmountOnExit>
        <PlayerNavbar>
          <Link to={`/${channelName}/page`} className='linkWithIcon' disabled={!channelName}>
            <MdAccountCircle size={26} />
            Channel page
          </Link>
        </PlayerNavbar>
      </CSSTransition>
      <VideoAndChatContainer
        id='twitch-embed'
        visible={visible}
        style={{
          display: 'unset',
        }}
      >
        <PlayerExtraButtons channelName={channelName}></PlayerExtraButtons>
        <StyledVideo
          src={`https://clips.twitch.tv/embed?clip=${videoId}&parent=aiofeed.com`}
          height='100%'
          width='100%'
          frameborder='0'
          allowfullscreen='true'
          scrolling='no'
          preload='auto'
        />
      </VideoAndChatContainer>
    </>
  );
};
export default PlayerClip;
