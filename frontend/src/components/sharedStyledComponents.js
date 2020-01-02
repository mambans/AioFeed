// import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const RefreshButton = styled(Button).attrs({ variant: "outline-secondary" })`
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  position: relative;
  left: 6px;

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
  }
`;

const ButtonList = styled(Button).attrs({ variant: "outline-secondary" })`
  display: flex;
  color: rgb(230, 230, 230);
  position: relative;
  /* right: 14px; */

  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  font-weight: bold;

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
  }
`;

const HeaderTitle = styled.h4`
  text-align: center;
  color: var(--subFeedHeaderColor);
  margin: auto;
  letter-spacing: 1px;
  width: 100%;
  margin: 2px auto;
  margin-right: calc(300px - 48px);
`;

const HeaderContainer = styled.div`
  border-bottom: var(--subFeedHeaderBorder);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
  width: 100%;
  min-width: 100%;
  margin-bottom: 10px;
  margin-top: 25px;
  height: 50.5px;
`;

const SubFeedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 50px;
  min-height: 400px;
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-areas:
    "video video"
    "title title"
    "info info";

  width: 336px;
  margin: 7px;
  max-height: 336px;
  margin-bottom: 15px;

  a {
    text-shadow: var(--linkTextShadow);
  }
`;

const VideoTitle = styled.a`
  color: var(--videoTitle);
  margin-top: 15px;
  margin-bottom: 5px;
  grid-area: title;
  font-size: 1.1rem;
  max-width: 336px;
  overflow: hidden;
  height: 45px;
  line-height: 1.2;

  &:hover {
    color: var(--videoTitleHover);
  }
`;

const ImageContainer = styled.div`
  grid-area: video;
  transition: all 0.2s ease-in-out;
  max-height: 189px;
  min-height: 189px;
  width: 336px;

  a {
    display: block;
  }

  img {
    border-radius: 10px;
    width: 100%;
    // width: 336px;
    max-height: 189px;
    object-fit: cover;
  }

  &:hover {
    z-index: 2;
    transform: scale(1.07);
    -webkit-transform: scale(1.07);
    -moz-transform: scale(1.07);
    -ms-transform: scale(1.07);
    -o-transform: scale(1.07);
    //transition-duration: 350ms;
  }
`;

const UnfollowButton = styled(Button).attrs({ variant: "link" })`
  color: rgba(109, 2, 2, 0.801);
  grid-row: 1;
  justify-self: right;
  width: 36px;
  padding-left: 0;
  padding: 2px;

  /* i {
    color: rgba(109, 2, 2, 0.801);
    transition: all 0.1s ease-in-out;
    -webkit-transition: all 0.1s ease-in-out;
    -moz-transition: all 0.1s ease-in-out;
    -ms-transition: all 0.1s ease-in-out;
    -o-transition: all 0.1s ease-in-out;

    &:hover {
      color: lighten(rgba(109, 2, 2, 0.801), 20%);
    }
  } */
  &:hover {
    /* color: lighten(rgba(109, 2, 2, 0.801), 20%) !important; */
    color: rgba(203, 14, 14, 0.8);
  }
`;

export {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  SubFeedContainer,
  VideoContainer,
  VideoTitle,
  ImageContainer,
  ButtonList,
  UnfollowButton,
};
