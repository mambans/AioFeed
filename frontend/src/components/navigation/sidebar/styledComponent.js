import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Icon from "react-icons-kit";
import { outdent } from "react-icons-kit/fa/outdent";

const StyledNavSidebar = styled.div`
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

const StyledNavSidebarBackdrop = styled.div`
  background: rgba(0, 0, 0, 0.1);
  width: calc(100vw - 308px);
  position: fixed;
  left: 0;
  height: 100vh;
  top: 65px;
`;

const StyledProfileImg = styled.img`
  width: 280px;
  height: calc(280px / 16 * 9);
`;

const StyledToggleSwitch = styled.label`
  display: flex;
  height: 40px;
  align-items: center;

  span {
    padding-left: 5px;
    font-size: 0, 9rem;
    font-weight: bold;
  }
`;

const StyledConnectTwitch = styled(Button)`
  background-color: hsla(268, 77%, 30%, 1);
  width: max-content;
  margin-left: 0;
  height: 42px;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  -o-border-radius: 10px;
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

const StyledConnectYoutube = styled(Button)`
  background-color: hsla(0, 65%, 18%, 1);
  width: max-content;
  margin-left: 0;
  height: 42px;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  -o-border-radius: 10px;
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
`;

const StyledLogoutContiner = styled.div`
  bottom: 0;
  position: absolute;
  right: 0;
  width: 160px;
  margin-right: 20px;

  button,
  a[label="linkAsButton"] {
    background-color: #333;
    width: max-content;
    min-width: 170px;
    height: 42.5px;
    border: thin solid #313131;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    -ms-border-radius: 10px;
    -o-border-radius: 10px;

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
`;

const StyledCreateFormTitle = styled.h3`
  border-bottom: 2px solid var(--greyInfo);
  text-align: center;
  /* width: 280px; */
  margin: auto;
  margin-top: 40px;
`;

const StyledCreateForm = styled(Form)`
  /* width: 280px; */
  margin: auto;
  margin-top: 50px;
`;

const StyledAlert = styled(Alert)`
  text-align: "center";
  margin: "auto";
  opacity: "0.7";
  padding: 0;
  text-align: center;

  .close {
    padding: 0 7px 0 0;
  }
`;

const StyledUploadImageButon = styled(Button).attrs({ variant: "outline-secondary" })`
  position: absolute;
  opacity: 0;
  width: 280px;
  height: calc(280px / 16 * 9);
  transition: all 0.5s;
  transition-delay: 0.5s;

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

const StyledSidebarTrigger = styled(Icon).attrs({ icon: outdent, size: 22 })`
  position: absolute;
  width: 52px;
  height: 80%;
  border: 2px solid #c6c6c6;
  border-radius: 80%;
  -webkit-border-radius: 80%;
  -moz-border-radius: 80%;
  -ms-border-radius: 80%;
  -o-border-radius: 80%;
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

export {
  StyledNavSidebar,
  StyledNavSidebarBackdrop,
  StyledProfileImg,
  StyledToggleSwitch,
  StyledConnectTwitch,
  StyledConnectYoutube,
  StyledLogoutContiner,
  StyledCreateFormTitle,
  StyledCreateForm,
  StyledAlert,
  StyledUploadImageButon,
  StyledSidebarTrigger,
};
