import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

import style from "./Footer.module.scss";

const Footer = () => {
  return (
    <div id={style.footer}>
      <div>
        <ul>
          <li>
            <Nav.Link as={NavLink} to='/'>
              Home
            </Nav.Link>
          </li>
          <li>
            <Nav.Link as={NavLink} to='/account'>
              Account
            </Nav.Link>
          </li>
          <li>
            <Nav.Link as={NavLink} to='/account/create'>
              Create account
            </Nav.Link>
          </li>
          <li>
            <Nav.Link as={NavLink} to='/account/login'>
              Login
            </Nav.Link>
          </li>
        </ul>
      </div>
      <div id={style.centerText}>
        <p>Test text</p>
        <p>Test text</p>
        <p className={style.centerBottomText}>
          <Nav.Link as={NavLink} to='/legality#Conditions'>
            -Conditions of Use
          </Nav.Link>
          <Nav.Link as={NavLink} to='/legality#Privacy'>
            -Privacy Notice
          </Nav.Link>
          © 2020 Skåne Sweden, Robin Persson. No rights reserved.
        </p>
      </div>
      <div>
        <ul>
          <li>
            <a href='https://github.com/mambans/Notifies'>Github-Notifies</a>
          </li>
          <li>
            <button
              className={style.buttonLinks}
              onClick={() => {
                window.open("mailto:perssons1996@gmail.com?subject=subject&body=body");
              }}>
              Email
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
