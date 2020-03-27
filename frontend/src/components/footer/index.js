import { FaGithub } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdRssFeed } from "react-icons/md";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React, { useContext } from "react";

import { NavigationContext } from "./../navigation/NavigationContext";
import {
  StyledFooterContainer,
  StyledCenterBottomText,
  StyledButtonLinks,
} from "./styledComponents";

const Footer = () => {
  const { footerVisible } = useContext(NavigationContext);

  return footerVisible ? (
    <StyledFooterContainer>
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
            <Nav.Link as={NavLink} to='/account'>
              <MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
              Account
            </Nav.Link>
          </li>
          <li>
            <Nav.Link as={NavLink} to='/account/create'>
              <MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
              Create account
            </Nav.Link>
          </li>
        </ul>
      </div>
      <div style={{ flexDirection: "column" }}>
        <p>Test text</p>
        <p>Test text</p>
        <StyledCenterBottomText>
          <Nav.Link as={NavLink} to='/legality#Conditions'>
            Conditions of Use
          </Nav.Link>
          <Nav.Link as={NavLink} to='/legality#Privacy'>
            Privacy Notice
          </Nav.Link>
          © 2020 Skåne Sweden, Robin Persson. No rights reserved.
        </StyledCenterBottomText>
      </div>
      <div>
        <ul>
          <li>
            <a href='https://github.com/mambans/Notifies'>
              <FaGithub size={20} style={{ marginRight: "0.75rem" }} />
              Github-Notifies
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
  ) : null;
};

export default Footer;
