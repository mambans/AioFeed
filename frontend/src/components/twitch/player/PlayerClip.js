import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { MdAccountCircle, MdVerticalAlignBottom } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import NavigationContext from './../../navigation/NavigationContext';
import {
  VideoAndChatContainer,
  StyledVideo,
  PlayerNavbar,
  ShowNavbarBtn,
  PlayerExtraButtons,
} from './StyledComponents';

export default () => {
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const { videoId, channelName } = useParams();
  document.title = `${channelName} - ${videoId}`;

  useEffect(() => {
    setShrinkNavbar('true');
    setFooterVisible(false);
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = 'visible';
      setShrinkNavbar('false');
      setFooterVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible]);

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
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
        <PlayerExtraButtons>
          <ShowNavbarBtn variant='dark' onClick={() => setVisible(!visible)}>
            <MdVerticalAlignBottom
              style={{
                transform: visible ? 'rotateX(180deg)' : 'unset',
                right: '10px',
              }}
              size={26}
              title='Show navbar'
            />
            Navbar
          </ShowNavbarBtn>
        </PlayerExtraButtons>
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
