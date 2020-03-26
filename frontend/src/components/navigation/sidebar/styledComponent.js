import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { MdRefresh } from "react-icons/md";
import { MdFormatIndentDecrease } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";

export const StyledNavSidebar = styled.div`
  position: fixed;
  top: 65px;
  /* right: 0; */
  width: 100px;
  height: calc(100vh - 65px);
  background: var(--navigationbarBackground);
  width: 300px;
  border-left: 2px solid #494949;
  padding: 10px;
`;

export const StyledNavSidebarBackdrop = styled.div`
  background: rgba(0, 0, 0, 0.1);
  width: calc(100vw - 308px);
  position: fixed;
  left: 0;
  height: 100vh;
  top: 65px;
`;

export const StyledProfileImg = styled.img`
  width: 280px;
  height: calc(280px / 16 * 9);
`;

export const StyledToggleSwitch = styled.label`
  display: flex;
  height: 40px;
  align-items: center;
  cursor: pointer;

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
  border-bottom: 2px solid var(--greyInfo);
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
  text-align: "center";
  margin: "auto";
  opacity: "0.7";
  padding: 0;
  text-align: center;

  .close {
    padding: 0 7px 0 0;
  }
`;

export const ShowAddFormBtn = styled(Button).attrs({ variant: "outline-secondary" })`
  position: absolute;
  opacity: 0;
  background: #00000073;
  width: 280px;
  height: calc(280px / 16 * 9);
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
  transform: ${({ open }) => (open ? "rotateY(180deg)" : "unset")};

  &:hover {
    opacity: 1;
  }
`;

export const StyledLogoutContiner = styled.div`
  bottom: 5px;
  position: absolute;
  right: 0;
  width: 100%;
  display: grid;
  grid-template-areas: "page del" "logout del";
  padding: 5px;
  grid-template-columns: 70% 30%;
  grid-template-rows: 60px;

  button[label="logout"],
  a[label="linkAsButton"] {
    background-color: #333;
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

  button[label="logout"] {
    grid-area: logout;
    margin: auto;
  }

  a[label="linkAsButton"] {
    grid-area: page;
    margin: auto;
  }
`;

export const DeleteAccountButton = styled(Button).attrs({ variant: "danger" })`
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

  label {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  input[type="submit"],
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

    :hover {
      background: #c70f0f;
    }
  }
  input[type="text"],
  input[type="password"] {
    width: 400px;
    margin: auto;
    /* font-size: 20px; */
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
  grid-template-areas: "name disconnect";
  grid-template-columns: 80% 20%;
  grid-template-rows: 50px;

  #username {
    grid-area: name;
    display: flex;
    align-items: center;
    background: #240944;
    border-radius: 25px;
    margin-right: 15px;

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
      width: 100%;
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

    &:hover {
      color: #ffffff;
    }
  }
`;

export const StyledReconnectIcon = styled(MdRefresh).attrs({ size: 30 })`
  position: absolute;
  width: 50px;
  height: 50px;
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
  margin-left: 254px;
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
  width: 280px !important;
  height: calc(280px / 16 * 9);
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
  }

  input[type="text"] {
    color: white;
    border: none;
    border-bottom: 1px solid white;
    background-color: transparent;
    background: transparent;
    width: 100%;
    text-align: center;
    margin: 10px 0;
  }

  input[type="submit"] {
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
