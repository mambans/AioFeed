import React from 'react';
import styled from 'styled-components';
import { Form, Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { MdRefresh } from 'react-icons/md';
import { MdFormatIndentDecrease } from 'react-icons/md';
import { FaWindowClose } from 'react-icons/fa';

export const StyledNavSidebar = styled.div`
  color: var(--textColor1);
  position: fixed;
  top: 70px;
  /* right: 0; */
  width: 100px;
  height: calc(100vh - 60px);
  background: var(--navigationbarBackground);
  width: 400px;
  border-left: 2px solid #494949;
  padding: 10px;
  overflow-y: scroll;
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin;
  right: 0;

  @media screen and (max-width: 1920px) {
    width: 300px;
  }
`;

export const StyledNavSidebarBackdrop = styled.div`
  background: rgba(0, 0, 0, 0.1);
  width: calc(100vw);
  position: fixed;
  left: 0;
  height: 100vh;
  top: 0px;
`;

export const StyledProfileImg = styled.img`
  /* max-width: calc(100% - 20px);
  max-height: calc(380px / 16 * 9); */
  width: 100%;
  display: flex;
  margin: auto;
`;

export const StyledToggleSwitch = styled.label`
  display: flex;
  /* height: 40px; */
  align-items: center;
  cursor: pointer;
  width: max-content;
  padding: ${({ padding }) => `${padding}px 0`};

  span {
    padding-left: 5px;
    font-size: 0, 9rem;
    font-weight: bold;
  }
`;

export const StyledConnectTwitch = styled(Button)`
  background-color: hsla(268, 77%, 30%, 1);
  /* width: max-content; */
  margin-left: 0;
  /* height: 42px; */
  border-radius: 10px;
  border: thin solid hsla(268, 77%, 30%, 1) !important;

  &:hover {
    background-color: hsla(268, 77%, 40%, 1);
    border: inherit;
  }

  &:focus {
    background-color: hsla(268, 77%, 40%, 1) !important;
    box-shadow: 0 0 0 0.2rem hsla(268, 77%, 50%, 1) !important;
  }

  &:active {
    background-color: hsla(268, 77%, 55%, 1) !important;
    border-color: hsla(268, 77%, 65%, 1) !important;
  }
`;

export const StyledConnectYoutube = styled(Button)`
  background-color: hsla(0, 65%, 18%, 1);
  width: max-content;
  margin-left: 0;
  height: 42px;
  border-radius: 10px;
  border: thin solid hsla(0, 65%, 18%, 1) !important;
  display: flex;

  &:hover {
    background-color: hsla(0, 65%, 28%, 1);
    border: inherit;
  }

  &:focus {
    background-color: hsla(0, 65%, 28%, 1) !important;
    box-shadow: 0 0 0 0.2rem hsla(0, 65%, 38%, 1) !important;
  }

  &:active {
    background-color: hsla(0, 65%, 40%, 1) !important;
    border-color: hsla(0, 65%, 45%, 1) !important;
  }

  :disabled {
    background-color: hsla(0, 65%, 18%, 1);
  }
`;

export const StyledCreateFormTitle = styled.div`
  text-align: center;
  border-bottom: 2px solid rgb(163, 163, 163);
  margin: auto;
  margin-top: 40px;

  p {
    margin-bottom: 2px;
    color: #c2c2c2;
  }
`;

export const StyledCreateForm = styled(Form)`
  /* width: 280px; */
  margin: auto;
  margin-top: 25px;
`;

export const StyledAlert = styled(Alert)`
  text-align: 'center';
  margin: 'auto';
  opacity: '0.7';
  padding: 0;
  text-align: center;

  .close {
    padding: 0 7px 0 0;
  }
`;

export const ShowAddFormBtn = styled(Button).attrs({ variant: 'outline-secondary' })`
  position: absolute;
  opacity: 0;
  background: #00000073;
  width: calc(100% - 20px);
  height: calc(380px / 16 * 9);
  transition: opacity 500ms, background 500ms;
  transition-delay: 0.2s;
  border: none;
  color: white;

  &:hover {
    opacity: 1;
    background: #00000073;
  }

  &:active {
    opacity: 1;
    background: #00000073;
  }

  &:focus {
    opacity: 1;
    background: #00000073;
  }
`;

export const StyledSidebarTrigger = styled(MdFormatIndentDecrease).attrs({ size: 32 })`
  position: absolute;
  /* width: 52px;
  height: 80%; */
  /* border: 2px solid #c6c6c6; */
  border-radius: 50%;
  display: flex !important  ;
  justify-content: center;
  align-items: center;
  transition: opacity 500ms, transform 350ms;
  color: #ffffff;
  background: #0000003b;
  opacity: 0;
  padding: 2px;
  transform: ${({ open }) => (open ? 'rotateY(180deg)' : 'unset')};

  &:hover {
    opacity: 1;
  }
`;

export const StyledLogoutContiner = styled.div`
  /* bottom: 5px; */
  /* position: absolute; */
  right: 0;
  width: 100%;
  display: grid;
  grid-template-areas: 'page del' 'logout del';
  padding: 5px;
  grid-template-columns: 70% 30%;
  grid-template-rows: 60px;

  height: 120px;

  button[label='logout'],
  a[label='linkAsButton'] {
    /* background-color: #333; */
    width: max-content;
    min-width: 170px;
    /* height: 42.5px; */
    border: thin solid #313131;
    border-radius: 10px;

    &:hover {
      background-color: lighten(#8a1f1f, 10%);
    }

    &:focus {
      box-shadow: 0 0 0 0.2rem lighten(#5c1313, 20%);
    }

    &:active {
      background-color: lighten(#791313, 25%);
      border-color: lighten(#581010, 35%);
    }
  }

  button[label='logout'] {
    grid-area: logout;
    margin: auto;
  }

  a[label='linkAsButton'] {
    grid-area: page;
    margin: auto;
  }
`;

export const DeleteAccountButton = styled(Button).attrs({ variant: 'danger' })`
  background: hsla(0, 65%, 28%, 1);
  border-radius: 10px;
  width: 52px;
  height: 42.5px;
  grid-area: del;
  grid-row: 2;
  margin: auto;

  i {
    height: 24px;
    display: flex;
    justify-content: center;
    width: 24px;
  }
`;

export const DeleteAccountForm = styled(Form)`
  margin-top: 25px;

  .form-group {
    width: 400px;
    margin: auto;
  }

  label {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  input[type='submit'],
  button {
    margin: auto;
    display: flex;
    font-size: 22px;
    padding: 10px 25px;
    background: #921818;
    border: 2px solid #c80c0c;
    color: white;
    border-radius: 10px;
    box-shadow: 2px 2px 5px black;
    margin-top: 50px;

    :hover {
      background: #c70f0f;
    }
  }
`;

export const DeleteAccountFooter = styled.div`
  /* margin-top: 60px; */
  position: absolute;
  bottom: 0;
`;

export const StyledConnectContainer = styled.div`
  margin-bottom: 10px;
  display: grid;
  grid-template-areas: 'name disconnect';
  /* grid-template-columns: 80% 20%; */
  /* grid-template-rows: 50px; */
  grid-template-columns: min-content;
  color: white;

  button {
    min-width: 200px;
    justify-self: left;
    display: flex;
    align-items: center;
    border-radius: 22px;

    svg {
      margin-right: 10px;
    }
  }

  .username#Twitch {
    background: #240944;
  }
  .username#Youtube {
    background: rgb(42, 9, 9);
  }

  .username {
    grid-area: name;
    display: flex;
    align-items: center;
    border-radius: 22px;
    margin-right: 15px;
    height: 42px;
    min-width: 200px;

    &:hover #reconnectIcon {
      opacity: 1;
    }

    > div {
      width: 50px;
      height: 100%;
      cursor: pointer;
    }

    img {
      border-radius: 50%;
      height: 100%;
      margin-right: 5px;
    }

    p {
      margin: 0;
      /* height: 100%; */
      /* width: 100%; */
      align-items: center;
      display: flex;
      justify-content: center;
      padding-right: 15px;
      font-size: 1.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  #connect {
    grid-area: name;
  }

  #disconnect {
    grid-area: disconnect;
    color: #b5b5b5;
    border-radius: 50%;
    width: 50px;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const StyledReconnectIcon = styled(MdRefresh).attrs({ size: 30 })`
  position: absolute;
  width: 42px;
  height: 42px;
  border: 2px solid #292929;
  border-radius: 80%;
  display: flex !important  ;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s;
  color: #ffffffd9;
  background: #0000003b;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

export const CloseAddFormBtn = styled(FaWindowClose).attrs({ size: 26 })`
  color: rgb(225, 225, 255);
  position: absolute;
  margin-left: calc(100% - 46px);
  cursor: pointer;
  z-index: 1;
  transition: color 250ms;

  &:hover {
    color: #ffffff;
  }
`;

export const ProfileImgInput = styled.form`
  position: absolute;
  border-radius: 5px !important;
  width: calc(100% - 20px);
  height: calc(380px / 16 * 9);
  top: unset !important;
  padding-top: 8px;

  background: #00000087 !important;
  border: none !important;
  box-shadow: 0 5px 10px 3px rgba(0, 0, 0, 0.25) !important // top: 1785px !important;
    form {
    padding: 5px;
  }

  label {
    text-align: center;
    width: inherit;
  }

  input[type='text'] {
    color: white;
    border: none;
    border-bottom: 1px solid white;
    background-color: transparent;
    background: transparent;
    width: 100%;
    text-align: center;
    margin: 10px 0;
  }

  input[type='submit'] {
    border-radius: 5px;
    border: thin solid #484848;
    background-color: #035879;
    color: rgb(224, 224, 224);
    width: 100%;
    margin-top: 5px;
    transition: color 250ms, background-color 250ms;

    &:hover {
      color: white;
      background-color: #097099;
    }
  }

  ul {
    list-style: none;
    padding-left: 10px;
    padding-right: 10px;
    background-color: rgb(8, 3, 20);

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      height: 35px;
      align-items: center;
    }

    li p {
      margin: 0;
    }
  }
`;

export const StyledAccAlert = styled(Alert)`
  text-align: center;
  opacity: '0.7';

  .close {
    padding: 0 7px 0 0;
  }
`;

export const ProfileImgContainer = styled.div`
  /* max-width: calc(100% - 20px); */
  width: 100%;
  max-height: calc(380px / 16 * 9);
`;

export const StyledToggleButton = styled(Button)`
  opacity: ${({ enabled }) => (enabled === 'true' ? 1 : 0.35)};
  margin: 10px;
  border: none !important;
  box-shadow: none !important;
  background: #434950;
  flex-grow: 1;

  flex-basis: ${({ buttonsperrow }) =>
    buttonsperrow ? `calc((100% - (20px * ${buttonsperrow})) / ${buttonsperrow})` : 'auto'};
/* align-items: center; */
  align-self: center;
  display: flex;
  justify-content: center;

  &[disabled] {
    opacity: 0.15;
  }

  &:focus {
    background: #434950;
    box-shadow: unset;
  }

  &:hover {
    /* box-shadow: 0 0 0 0.1rem ${({ enabled }) => (enabled === 'true' ? 'green' : 'yellow')}; */
    /* background:${({ enabled }) => (enabled === 'true' ? 'rgb(150, 0 ,0)' : 'rgb(0, 150, 0)')}; */
    background:${({ enabled }) =>
      enabled === 'true' ? 'rgba(0, 150, 0, 0.5)' : 'rgba(150, 0 ,0, 0.5)'};
  }
`;

export const StyledToggleButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

export const ToggleButtonsContainer = ({ children, buttonsperrow }) => {
  const childrens = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      buttonsperrow: buttonsperrow,
    });
  });

  return <StyledToggleButtonsContainer>{childrens}</StyledToggleButtonsContainer>;
};

export const ToggleButtonsContainerHeader = styled.h5`
  margin-bottom: 0.2rem;
  padding-bottom: 0.3rem;
  text-align: center;
  border-bottom: thin solid rgb(50, 50, 50);
  color: rgb(200, 200, 200);
`;
