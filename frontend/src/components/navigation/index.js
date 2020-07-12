import React, { useContext, useRef } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

import RenderNotifications from './../notifications';
import NavigationContext from './NavigationContext';
import './Navigation.scss';
import Sidebar from './sidebar';
import GameSearchBar from '../twitch/categoryTopStreams/GameSearchBar';
import ChannelSearchList from './../twitch/channelList/index';
import NavExpandingSides from './NavExpandingSides';

const StyledNavbar = styled(Navbar)`
  display: flex;
  justify-content: space-between;
  padding-right: 0;
`;

const StyledNav = styled(Nav)`
  &&& {
    margin: 0 !important;
    padding: 0 20px;
  }
`;

export default (prop) => {
  const { visible, shrinkNavbar } = useContext(NavigationContext);
  const leftExpand = useRef();

  return (
    <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
      <StyledNavbar
        mode={prop.fixed ? 'fixed' : 'unset'}
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
            style={{ display: 'flex', alignItems: 'center', minWidth: '200px', paddingLeft: '0' }}
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
            <Nav.Link as={NavLink} to='/feed/' activeClassName='active'>
              Feed
            </Nav.Link>
          </StyledNav>
          <FaAngleRight id='arrow' size={20} />
        </NavExpandingSides>
        <NavExpandingSides side='right'>
          <FaAngleLeft id='arrow' size={20} />
          <GameSearchBar
            position='fixed'
            showButton={false}
            style={{ background: 'none', boxShadow: 'none', margin: '0 10px' }}
            inputStyle={{ textOverflow: 'unset' }}
            alwaysFetchNew={true}
            openInNewTab={true}
          />
          <ChannelSearchList
            position='fixed'
            showButton={false}
            style={{ background: 'none', boxShadow: 'none', margin: '0 10px' }}
            inputStyle={{ textOverflow: 'unset' }}
          />
          <Sidebar />
        </NavExpandingSides>
      </StyledNavbar>
    </CSSTransition>
  );
};
