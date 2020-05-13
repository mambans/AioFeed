import { FaGithub } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdRssFeed } from "react-icons/md";
import { Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import React, { useContext } from "react";

import NavigationContext from "./../navigation/NavigationContext";
import FeedsContext from "./../feed/FeedsContext";
import {
  StyledFooterContainer,
  StyledCenterBottomText,
  StyledButtonLinks,
} from "./styledComponents";

export default () => {
  const { footerVisible, setRenderModal, setShowSidebar } = useContext(NavigationContext);
  const { enableTwitter, showTwitchSidebar } = useContext(FeedsContext);
  const location = useLocation();

  return (
    footerVisible && (
      <StyledFooterContainer
        enableTwitter={enableTwitter}
        showTwitchSidebar={showTwitchSidebar}
        location={location.pathname}>
        <div>
          <ul>
            <li>
              <Nav.Link as={NavLink} to='/'>
                <FaHome size={20} style={{ marginRight: "0.75rem" }} />
                Home
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={NavLink} to='/feed'>
                <MdRssFeed size={20} style={{ marginRight: "0.75rem" }} />
                Feed
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={NavLink} to='/category'>
                <MdRssFeed size={20} style={{ marginRight: "0.75rem" }} />
                Top streams
              </Nav.Link>
            </li>
            <li>
              <div
                className='button'
                onClick={() => {
                  setRenderModal("account");
                  setShowSidebar(true);
                }}>
                <MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
                Account
              </div>
            </li>
            <li>
              <div
                className='button'
                onClick={() => {
                  setRenderModal("create");
                  setShowSidebar(true);
                }}>
                <MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
                Create account
              </div>
            </li>
          </ul>
        </div>
        <div style={{ flexDirection: "column", width: "50%" }}>
          <p>Test text</p>
          <p>Test text</p>
          <StyledCenterBottomText>
            <Nav.Link as={NavLink} to='/legality#Conditions'>
              Conditions of Use
            </Nav.Link>
            <Nav.Link as={NavLink} to='/legality#Privacy'>
              Privacy Notice
            </Nav.Link>
            © 2020 Sweden, Robin Persson.
          </StyledCenterBottomText>
        </div>
        <div>
          <ul>
            <li>
              <a href='https://github.com/mambans/AioFeed'>
                <FaGithub size={20} style={{ marginRight: "0.75rem" }} />
                Github-AioFeed
              </a>
            </li>
            <li>
              <StyledButtonLinks
                onClick={() => {
                  window.open("mailto:perssons1996@gmail.com?subject=subject&body=body");
                }}>
                <MdEmail size={20} style={{ marginRight: "0.75rem" }} />
                Email
              </StyledButtonLinks>
            </li>
          </ul>
        </div>
      </StyledFooterContainer>
    )
  );
};
