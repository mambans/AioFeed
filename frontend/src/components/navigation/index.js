import React, { useContext, useRef } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FaAngleRight, FaAngleLeft, FaTwitch, FaYoutube } from 'react-icons/fa';
import { MdVideocam, MdStar } from 'react-icons/md';
import { NavDropdown } from 'react-bootstrap';

import RenderNotifications from './../notifications';
import NavigationContext from './NavigationContext';
import './Navigation.scss';
import Sidebar from './sidebar';
import GameSearchBar from '../twitch/categoryTopStreams/GameSearchBar';
import ChannelSearchList from './../twitch/channelList/index';
import NavExpandingSides from './NavExpandingSides';
import VodsContext, { VodsProvider } from '../twitch/vods/VodsContext';
import DropDown from './DropDown';

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
    white-space: nowrap;

    svg {
      margin: 0 2px;
    }
  }
`;

const Navigation = () => {
  const { visible, shrinkNavbar } = useContext(NavigationContext);
  const { setChannels } = useContext(VodsContext) || {};
  const leftExpand = useRef();

  const channelSearchListProps = {
    position: 'fixed',
    showButton: false,
    style: { background: 'none', boxShadow: 'none', margin: '0 10px' },
    inputStyle: { textOverflow: 'unset' },
  };

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
              src={`${process.env.PUBLIC_URL}/android-chrome-192x192.webp`}
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
            <Nav.Link as={NavLink} to='/category' activeClassName='active'>
              Top Streams
            </Nav.Link>
            <DropDown title='Individual Feeds'>
              <NavDropdown.Item as={NavLink} to='/favorites'>
                <MdStar size={16} color='rgb(255,255,0)' />
                Favorites
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/live'>
                <FaTwitch size={16} color='rgb(118, 65, 198)' />
                Live
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/youtube'>
                <FaYoutube size={16} color='rgb(255, 0, 0)' />
                YouTube
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/vods'>
                <MdVideocam size={16} color='rgb(118, 65, 198)' />
                Vods
              </NavDropdown.Item>
            </DropDown>
          </StyledNav>
          <FaAngleRight className='arrow' size={20} />
          <FaAngleRight className='arrow shadow' size={20} />
        </NavExpandingSides>

        <NavExpandingSides side='right'>
          <FaAngleLeft className='arrow' size={20} />
          <FaAngleLeft className='arrow shadow' size={20} />
          <GameSearchBar {...channelSearchListProps} openInNewTab={true} />
          {setChannels ? (
            <ChannelSearchList {...channelSearchListProps} />
          ) : (
            <VodsProvider forceMount={true}>
              <ChannelSearchList {...channelSearchListProps} />
            </VodsProvider>
          )}
          <Sidebar />
        </NavExpandingSides>
      </StyledNavbar>
    </CSSTransition>
  );
};

export default Navigation;
