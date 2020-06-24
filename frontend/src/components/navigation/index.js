import React, { useContext, useState } from 'react';
import { Navbar, NavDropdown, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FaGithub } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

import RenderNotifications from './../notifications';
import NavigationContext from './NavigationContext';
import './Navigation.scss';
import Sidebar from './sidebar';
import ChangeLogs from '../changeLogs';
import styles from '../changeLogs/ChangeLogs.module.scss';
import { AddCookie, getCookie } from '../../util/Utils';
import GameSearchBar from '../twitch/categoryTopStreams/GameSearchBar';
import ChannelSearchList from './../twitch/channelList/index';

const SIDEDIVSWIDTH = '600px';

const StyledNavbar = styled(Navbar)`
  display: flex;
  justify-content: space-between;
`;

const StyledNav = styled(Nav)`
  &&& {
    margin: 0 !important;
  }
`;

export default (prop) => {
  const NewAlertName = `GlobalAlert-NewAlertName`;
  AddCookie(NewAlertName, true);
  const { visible, shrinkNavbar } = useContext(NavigationContext);
  const [show, setShow] = useState(!getCookie(NewAlertName));

  const handleClose = () => {
    setShow(false);
  };

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
        <div style={{ display: 'flex', height: '100%', width: SIDEDIVSWIDTH }}>
          <Nav.Link as={NavLink} to='/' className='logo-link'>
            <img
              src={`${process.env.PUBLIC_URL}/android-chrome-512x512.png`}
              alt='logo'
              className='logo'
            />
            AioFeed
          </Nav.Link>
          <RenderNotifications />
        </div>
        <StyledNav className='mr-auto'>
          <Nav.Link as={NavLink} to='/home' activeClassName='active'>
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to='/feed/' activeClassName='active'>
            Feed
          </Nav.Link>
        </StyledNav>
        <Nav style={{ justifyContent: 'right', alignItems: 'center', width: SIDEDIVSWIDTH }}>
          <GameSearchBar
            showButton={false}
            style={{ background: 'none', boxShadow: 'none', margin: '0 10px' }}
            inputStyle={{ textOverflow: 'unset' }}
            alwaysFetchNew={true}
            openInNewTab={true}
          />

          <ChannelSearchList
            showButton={false}
            style={{ background: 'none', boxShadow: 'none', margin: '0 10px' }}
            inputStyle={{ textOverflow: 'unset' }}
            placeholder='channel..'
          />
          <NavDropdown title='Other' id='collasible-nav-dropdown'>
            <NavDropdown.Item href='https://github.com/mambans/AioFeed'>
              <FaGithub size={24} style={{ marginRight: '0.75rem' }} />
              AioFeed-Github
            </NavDropdown.Item>

            <NavDropdown.Item
              as={Button}
              onClick={() => {
                setShow(!show);
              }}
            >
              <FaGithub size={24} style={{ marginRight: '0.75rem' }} />
              Changelog
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to='/legality#Conditions'>
              Conditions of Use
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to='/legality#Privacy'>
              Privacy Notice
            </NavDropdown.Item>
          </NavDropdown>
          <Modal
            show={show}
            onHide={handleClose}
            dialogClassName={styles.modal}
            backdropClassName={styles.modalBackdrop}
          >
            <ChangeLogs handleClose={handleClose} NewAlertName={NewAlertName} />
          </Modal>
          <Sidebar />
        </Nav>
      </StyledNavbar>
    </CSSTransition>
  );
};
