import { FaGithub } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { MdEmail } from 'react-icons/md';
import { MdRssFeed } from 'react-icons/md';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import React, { useContext, useState, useRef } from 'react';

import NavigationContext from './../navigation/NavigationContext';
import {
  StyledFooterContainer,
  StyledCenterBottomText,
  StyledButtonLinks,
} from './styledComponents';
import ChangeLogs from '../changeLogs';
import styles from '../changeLogs/ChangeLogs.module.scss';

const Footer = () => {
  const { footerVisible, setRenderModal, setShowSidebar } = useContext(NavigationContext);
  const [show, setShow] = useState();
  const ref = useRef();

  const handleClose = () => setShow(false);

  return (
    footerVisible && (
      <StyledFooterContainer ref={ref}>
        <div>
          <ul>
            <li>
              <Nav.Link as={NavLink} to='/'>
                <FaHome size={20} style={{ marginRight: '0.75rem' }} />
                Home
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={NavLink} to='/feed'>
                <MdRssFeed size={20} style={{ marginRight: '0.75rem' }} />
                Feed
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={NavLink} to='/category'>
                <MdRssFeed size={20} style={{ marginRight: '0.75rem' }} />
                Top streams
              </Nav.Link>
            </li>
            <li>
              <div
                className='button'
                onClick={() => {
                  setRenderModal('account');
                  setShowSidebar(true);
                }}
              >
                <MdAccountCircle size={20} style={{ marginRight: '0.75rem' }} />
                Account
              </div>
            </li>
            <li>
              <div
                className='button'
                onClick={() => {
                  setRenderModal('create');
                  setShowSidebar(true);
                }}
              >
                <MdAccountCircle size={20} style={{ marginRight: '0.75rem' }} />
                Create account
              </div>
            </li>
          </ul>
        </div>
        <div style={{ flexDirection: 'column', width: '50%' }}>
          <p></p>
          <p></p>
          <StyledCenterBottomText>
            <Nav.Link as={NavLink} to='/legality#Conditions'>
              Conditions of Use
            </Nav.Link>
            <Nav.Link as={NavLink} to='/legality#Privacy'>
              Privacy Notice
            </Nav.Link>

            <span>© 2020 Sweden, Robin Persson.</span>
          </StyledCenterBottomText>
        </div>
        <div>
          <ul>
            <li>
              <a href='https://github.com/mambans/AioFeed'>
                <FaGithub size={20} style={{ marginRight: '0.75rem' }} />
                AioFeed on Github
              </a>
            </li>
            <li>
              <StyledButtonLinks onClick={() => setShow(!show)}>
                <FaGithub size={20} style={{ marginRight: '0.75rem' }} />
                Changelog
              </StyledButtonLinks>
            </li>
            <li>
              <StyledButtonLinks
                onClick={() =>
                  window.open('mailto:perssons1996@gmail.com?subject=subject&body=body')
                }
              >
                <MdEmail size={20} style={{ marginRight: '0.75rem' }} />
                Email
              </StyledButtonLinks>
            </li>
          </ul>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          dialogClassName={styles.modal}
          backdropClassName={styles.modalBackdrop}
        >
          <ChangeLogs handleClose={handleClose} />
        </Modal>
      </StyledFooterContainer>
    )
  );
};

export default Footer;
