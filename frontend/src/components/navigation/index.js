import React, { useContext, useRef } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FaAngleRight, FaAngleLeft, FaTwitch, FaYoutube } from 'react-icons/fa';
import { MdVideocam, MdStar } from 'react-icons/md';

import RenderNotifications from './../notifications';
import NavigationContext from './NavigationContext';
import './Navigation.scss';
import Sidebar from './sidebar';
import GameSearchBar from '../twitch/categoryTopStreams/GameSearchBar';
import ChannelSearchList from './../twitch/channelList/index';
import NavExpandingSides from './NavExpandingSides';
import { VodsProvider } from '../twitch/vods/VodsContext';

const StyledNavbar = styled(Navbar)`
  display: flex;
  justify-content: space-between;
  padding-right: 0;
`;

const StyledNav = styled(Nav)`
  &&& {
    margin: 0;
    padding: 0 20px;
  }

  a {
    display: flex;
    align-items: center;

    svg {
      margin: 0 2px;
    }
  }
`;

export default () => {
  const { visible, shrinkNavbar } = useContext(NavigationContext);
  const leftExpand = useRef();

  return (
    <CSSTransition in={visible} timeout={300} classNames='fade-250ms' unmountOnExit>
      <StyledNavbar
        mode='fixed'
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
        shrink={shrinkNavbar}
      >
        <NavExpandingSides side='left' ref={leftExpand}>
          <Nav.Link
            as={NavLink}
            to='/'
            className='logo-link'
            style={{ display: 'flex', alignItems: 'center', paddingLeft: '0', minWidth: '141px' }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/android-chrome-512x512.png`}
              alt='logo'
              className='logo'
            />
            AioFeed
          </Nav.Link>
          <RenderNotifications leftExpandRef={leftExpand} />
          <StyledNav className='mr-auto'>
            <Nav.Link as={NavLink} to='/home' activeClassName='active'>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to='/feed' activeClassName='active'>
              Feed
            </Nav.Link>
            <Nav.Link as={NavLink} to='/favorites' activeClassName='active'>
              <MdStar size={16} color='rgb(255,255,0)' />
              Favorites
            </Nav.Link>
            <Nav.Link as={NavLink} to='/live' activeClassName='active'>
              <FaTwitch size={16} color='rgb(118, 65, 198)' />
              Live
            </Nav.Link>
            <Nav.Link as={NavLink} to='/youtube' activeClassName='active'>
              <FaYoutube size={16} color='rgb(255, 0, 0)' />
              YouTube
            </Nav.Link>
            <Nav.Link as={NavLink} to='/vods' activeClassName='active'>
              <MdVideocam size={16} color='rgb(118, 65, 198)' />
              Vods
            </Nav.Link>
          </StyledNav>
          <FaAngleRight className='arrow' size={20} />
          <FaAngleRight className='arrow shadow' size={20} />
        </NavExpandingSides>
        <NavExpandingSides side='right'>
          <FaAngleLeft className='arrow' size={20} />
          <FaAngleLeft className='arrow shadow' size={20} />
          <GameSearchBar
            position='fixed'
            showButton={false}
            style={{ background: 'none', boxShadow: 'none', margin: '0 10px' }}
            inputStyle={{ textOverflow: 'unset' }}
            openInNewTab={true}
          />
          <VodsProvider>
            <ChannelSearchList
              position='fixed'
              showButton={false}
              style={{ background: 'none', boxShadow: 'none', margin: '0 10px' }}
              inputStyle={{ textOverflow: 'unset' }}
            />
          </VodsProvider>
          <Sidebar />
        </NavExpandingSides>
      </StyledNavbar>
    </CSSTransition>
  );
};
