import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import React from 'react';

import {
  VideoAndChatContainer,
  StyledVideo,
  PlayerNavbar,
  PlayerExtraButtons,
} from './StyledComponents';
import useFullscreen from '../../../hooks/useFullscreen';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { useRecoilValue } from 'recoil';
import { navigationBarVisibleAtom } from '../../navigation/atoms';

const PlayerClip = () => {
  const navigationBarVisible = useRecoilValue(navigationBarVisibleAtom);

  const { videoId, channelName } = useParams();
  useDocumentTitle(`${channelName} - ${videoId}`);

  useFullscreen({ hideNavbar: false });

  return (
    <>
      <CSSTransition in={navigationBarVisible} timeout={300} classNames='fade-250ms' unmountOnExit>
        <PlayerNavbar>
          <Link to={`/${channelName}/page`} className='linkWithIcon' disabled={!channelName}>
            <MdAccountCircle size={26} />
            Channel page
          </Link>
        </PlayerNavbar>
      </CSSTransition>
      <VideoAndChatContainer
        id='twitch-embed'
        visible={navigationBarVisible}
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
