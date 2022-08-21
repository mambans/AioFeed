import React, { useContext, useRef } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FaAngleRight, FaAngleLeft, FaTwitch, FaYoutube } from 'react-icons/fa';
import { MdVideocam } from 'react-icons/md';
import { HiViewList } from 'react-icons/hi';
import { NavDropdown } from 'react-bootstrap';

import RenderNotifications from './../notifications';
import './Navigation.scss';
import GameSearchBar from '../twitch/categoryTopStreams/GameSearchBar';
import NavExpandingSides from './NavExpandingSides';
import DropDown from './DropDown';
import LogsContext from '../logs/LogsContext';
import Colors from '../../components/themes/Colors';
import { NavigationSidebar } from './sidebar';
import { navigationBarVisibleAtom } from './atoms';
import { useRecoilValue } from 'recoil';
import ChannelSearchBar from '../twitch/searchbars/ChannelSearchBar';

const StyledNavbar = styled(Navbar)`
  display: flex;
  justify-content: space-between;
  padding-right: 0;

  /* body.modal-open & {
    padding-right: 8px;
  } */
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
  const navigationSidebarOverflow = useRecoilValue(navigationBarVisibleAtom);

  const { LogsIcon } = useContext(LogsContext) || {};
  const leftExpand = useRef();

  const channelSearchListProps = {
    position: 'fixed',
    showButton: false,
    style: { background: 'none', boxShadow: 'none', margin: '0 10px' },
    inputStyle: { textOverflow: 'unset' },
  };

  return (
    <CSSTransition
      in={navigationSidebarOverflow}
      timeout={300}
      classNames='fade-250ms'
      unmountOnExit
    >
      <StyledNavbar mode='fixed' collapseOnSelect expand='lg' bg='dark' variant='dark'>
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
            <Nav.Link
              as={NavLink}
              to='/home'
              className={({ isActive }) => `link ${isActive ? 'active-link' : 'inactive-link'}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to='/feed'
              className={({ isActive }) => `link ${isActive ? 'active-link' : 'inactive-link'}`}
            >
              Feed
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to='/category'
              className={({ isActive }) => `link ${isActive ? 'active-link' : 'inactive-link'}`}
            >
              Top Streams
            </Nav.Link>
            <DropDown title='Individual Feeds'>
              <NavDropdown.Item as={NavLink} to='/mylists'>
                <HiViewList size={18} color={Colors.green} />
                My lists
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/live'>
                <FaTwitch size={16} color={Colors.purple} />
                Live
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/youtube'>
                <FaYoutube size={16} color={Colors.red} />
                YouTube
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/vods'>
                <MdVideocam size={16} color={Colors.purple} />
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
          <ChannelSearchBar {...channelSearchListProps} />
          {/* <ChannelSearchLi{...channelSearchListProps} st {...channelSearchListProps} /> */}
          {LogsIcon}
          <NavigationSidebar />
        </NavExpandingSides>
      </StyledNavbar>
    </CSSTransition>
  );
};

export default Navigation;
