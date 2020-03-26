import styled from "styled-components";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const RefreshButton = styled(Button).attrs({ variant: "outline-secondary" })`
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  position: relative;
  left: 6px;
  align-items: center;

  padding: 4px;
  width: 50px;

  .SpinnerWrapper {
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div[aria-label="Countdown timer"] {
    margin: 5px auto !important ;
  }

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
  }
`;

export const ButtonList = styled(Button).attrs({ variant: "outline-secondary" })`
  display: flex;
  color: rgb(230, 230, 230);
  position: relative;
  /* right: 14px; */

  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  font-weight: bold;
  align-items: center;

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
  }
`;

export const HeaderTitle = styled.h4`
  text-align: center;
  color: var(--subFeedHeaderColor);
  margin: auto;
  letter-spacing: 1px;
  width: 100%;
  margin: 2px auto;

  svg {
    margin: 0 10px;
  }
`;

export const HeaderContainer = styled.div`
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

export const SubFeedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 50px;
  min-height: 400px;
  max-width: 100%;
`;

export const VideoContainer = styled.div`
  display: grid;
  grid-template-areas:
    "video video"
    "title title"
    "info info";

  width: 336px;
  margin: 7px;
  max-height: 336px;
  margin-bottom: 15px;
  position: relative;

  a {
    text-shadow: var(--linkTextShadow);
  }
`;

export const VideoTitle = styled(Link)`
  color: var(--videoTitle);
  margin-top: 15px;
  margin-bottom: 5px;
  grid-area: title;
  font-size: 1.1rem;
  max-width: 336px;
  overflow: hidden;
  height: 45px;
  line-height: 1.2;
  padding: 0;

  &:hover {
    color: var(--videoTitleHover);
  }
`;

export const ImageContainer = styled.div`
  grid-area: video;
  transition: all 0.2s ease-in-out;
  max-height: 189px;
  min-height: 189px;
  width: 336px;

  a {
    display: block;
  }

  .loadingSpinner {
    position: absolute;
    height: 75px;
    width: 75px;
    background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
    margin-left: 129.5px;
    margin-top: 57px;
    border-width: 0.5em;
    transition: opacity 300ms 700ms;
    opacity: 0;
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
    transform: scale(1.15);
    box-shadow: 0 0px 0px 0px #be0e0e00, 0 0px 0px 0px #be0e0e00,
      12px 0 50px -4px rgba(0, 0, 0, 0.8), -12px 0 50px -4px rgba(0, 0, 0, 0.8);

    .loadingSpinner {
      opacity: 0.5;
    }

    time {
      z-index: 1;
    }
  }
`;

export const UnfollowButton = styled(Button).attrs({ variant: "link" })`
  color: rgba(109, 2, 2, 0.801);
  grid-row: 1;
  justify-self: right;
  width: 36px;
  padding-left: 0;
  padding: 2px;

  &:hover {
    color: rgba(203, 14, 14, 0.8);
  }
`;

export const VodRemoveButton = styled(Button).attrs({ variant: "link" })`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  padding: 0px;
  opacity: ${({ loweropacity }) => loweropacity || 1};
  margin-right: ${({ marginright }) => marginright || "unset"};
  opacity: 0;
  transition: opacity 250ms;

  &:hover {
    color: rgb(225, 000, 000);
    opacity: 1;
  }
`;

export const VodAddButton = styled(Button).attrs({ variant: "link" })`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  padding: 0px;
  margin-right: ${({ marginright }) => marginright || "unset"};
  opacity: 0;
  transition: opacity 250ms;

  &:hover {
    color: #14ae14;
    opacity: 1;
  }
`;

export const StyledLoadingContainer = styled.div`
  display: grid;
  justify-content: center;
  transition: all 2s linear ease-in;

  h1 {
    color: #dddddd;
    text-align: center;
  }
`;
