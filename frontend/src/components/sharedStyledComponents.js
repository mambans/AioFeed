import styled from "styled-components";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const RefreshButton = styled(Button).attrs({ variant: "outline-secondary" })`
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  position: relative;
  left: 6px;
  align-items: center;

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
  align-items: center;

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
  }
`;

const HeaderTitle = styled.h4`
  text-align: center;
  color: var(--subFeedHeaderColor);
  /* margin: 0; */
  margin: auto;
  letter-spacing: 1px;
  width: 100%;
  margin: 2px auto;
  /* margin-right: calc(300px - 48px); */

  /* font-size: 1.25rem;
  font-weight: bold;
  color: #d5d5d5; */

  svg {
    margin: 0 10px;
  }
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

const VideoTitle = styled(Link)`
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
    /* transform: scale(1.07);*/

    transform: scale(1.15);
    /* box-shadow: 0px 0px 75px 10px black; */
    box-shadow: 0 0px 0px 0px #be0e0e00, 0 0px 0px 0px #be0e0e00,
      12px 0 50px -4px rgba(0, 0, 0, 0.8), -12px 0 50px -4px rgba(0, 0, 0, 0.8);
  }
`;

const UnfollowButton = styled(Button).attrs({ variant: "link" })`
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

const VodRemoveButton = styled(Button).attrs({ variant: "link" })`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  width: 36px;
  padding-left: 0;
  padding: 2px;

  &:hover {
    color: rgb(225, 000, 000);
  }
`;

const VodAddButton = styled(Button).attrs({ variant: "link" })`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  width: 36px;
  padding-left: 0;
  padding: 2px;

  &:hover {
    color: #14ae14;
  }
`;

const StyledLoadingContainer = styled.div`
  display: grid;
  justify-content: center;
  transition: all 2s linear ease-in;

  h1 {
    color: #dddddd;
    text-align: center;
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
  VodRemoveButton,
  VodAddButton,
  StyledLoadingContainer,
};
