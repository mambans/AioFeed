import React from "react";
import styled, { keyframes } from "styled-components";
import { Button } from "react-bootstrap";
import { MdVideocam } from "react-icons/md";
import { Link } from "react-router-dom";

export const ChannelContainer = styled.div`
  min-height: 100vh;
  min-width: 100%;
`;

export const Banner = styled.div`
  height: 300px;
  margin-bottom: 20px;

  #Banner {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const BannerInfoOverlay = styled.div`
  /* height: 100%; */
  position: absolute;
  top: 65px;
  width: 100%;
`;

const pulse = keyframes`
  0% {
    background: #1a1b1dd1;
  }
  40% {
    background: #25262ad1;
  }
  100% {
    background: #1a1b1dd1;
  }
`;

export const Name = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  display: grid;
  justify-items: center;
  background-color: #0000;
  text-shadow: 0px 0px 2px black;

  #HeaderChannelInfo {
    z-index: 1;
    display: flex;
    flex-flow: column;
    text-align: center;
    background-color: #00000021;
    box-shadow: 20px 20px 20px #000000bd;
    border-radius: 15px;
    padding: 10px;
    width: calc(30% - 6px);
    height: calc(100% - 6px);
    margin-top: 15px;

    @media screen and (max-width: 1920px) {
      width: calc(40% - 6px);
    }

    p {
      margin-bottom: 0.6rem;
    }

    h1,
    p,
    a {
      mix-blend-mode: screen;
    }

    #ChannelLiveLink {
      color: white;
      font-size: 2rem !important;
      padding: 0 10px;
    }

    #title {
      font-size: 1.1rem;
    }

    #game {
      color: rgb(240, 240, 240);
      margin-bottom: 0.6rem;
      font-size: inherit;
      padding: 0;

      &:hover {
        text-decoration: underline;
      }
    }

    #desc,
    #updated,
    #game,
    #followViews {
      color: #ffffff;
    }

    #followViews {
      display: flex;
      justify-content: center;

      p:first-child {
        margin-right: 50px;
      }
    }
    #placeholderProfileImgCircle {
      height: 50px;
      border-radius: 50%;
      background: #817979;
      width: 50px;
      margin-right: 20px;
      margin-right: 20px;
      margin-left: -70px;
      animation: ${pulse} 4s linear infinite;
      transform: translate3d(0, 0, 0);
    }

    #PlaceholderSmallText {
      /* background-color: #adadadcf; */
      height: 24px;
      margin-bottom: 1rem;
      width: 100px;
      border-radius: 10px;
      animation: ${pulse} 4s linear infinite;
      transform: translate3d(0, 0, 0);
    }
  }

  #ChannelName {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    h1 {
      margin: 0;
      padding: 0 10px;
    }

    .StreamFollowBtn,
    .StreamUpdateNoitificationsButton {
      opacity: 1;
    }
  }

  #profileIcon {
    padding: 0 10px;
  }

  img {
    height: 50px;
  }

  #partnered {
    height: 25px;
  }
`;

export const SubFeedHeader = styled.div`
  display: grid;
  grid-template-areas: "sort title gap";
  grid-template-columns: 20% auto 20%;
  margin: 20px auto 10px auto;
  border-bottom: 1px solid grey;
  max-width: 100%;

  h3 {
    text-align: center;
    grid-area: title;
  }
`;

export const SortButton = styled(Button).attrs({ variant: "dark" })`
  width: 200px;
  background-color: rgba(20, 23, 25, 0.5);
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover,
  &:active,
  &:focus {
    background-color: rgba(20, 23, 25, 0.9);
  }

  svg {
    padding-right: 5px;
  }
`;

const breathRedColor = keyframes`
    0% {
      color: #ff0000;
    }
    50% {
      color: #8a0000;
    }
    100% {
      color: #ff0000;
    }
  `;

export const SortDropDownList = styled.ul`
  position: absolute;
  padding: 10px;
  list-style: none;
  /* margin-top: 42px; */
  background-color: rgba(20, 23, 25, 0.9);
  border-radius: 0 0 5px 5px;
  width: 200px;
  border-color: #1d2124;
  box-shadow: 0 0.1rem 0 0.2rem rgba(82, 88, 93, 0.5);
  z-index: 3;

  li {
    padding: 5px;
    cursor: pointer;
    text-align: center;
  }
`;

export const LiveIndicator = styled.div`
  color: red;
  /* margin-left: -55px;
  padding-right: 15px; */
  animation: ${breathRedColor} 3s linear 1s infinite;

  p {
    margin: 0;
    text-align: left;
    padding-left: 5px;
    margin-bottom: 0 !important;
  }
`;

export const LiveIndicatorIcon = styled(MdVideocam).attrs({ size: 30 })`
  /* position: absolute; */
`;

export const VideoPlayer = styled.div`
  height: 300px;
  width: calc(300px * 1.777777777777778);
  position: absolute;
  z-index: 100;
`;

export const Chat = styled.iframe`
  height: 300px;
  width: calc(300px * 1.777777777777778);
  position: absolute;
  z-index: 100;
  right: 0;
  border: none;
`;

export const StyledLiveInfoContainer = styled(Link)`
  align-items: center;
  width: 200px;
  display: flex;
  margin-left: -200px;
  justify-content: center;
  color: white;

  &:hover {
    color: white;
  }

  #LiveDetails {
    display: flex;
    flex-direction: column;
  }

  @media screen and (max-width: 1920px) {
    margin-right: calc(40% - 250px);
  }
`;

export const BlurredBackgroundImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  filter: blur(10px) brightness(0.75);
  background-image: url(${({ image }) => image});
  background-size: cover;
`;

export const BlurredBannerImage = styled.div`
  position: absolute;
  width: 30%;
  height: 100%;
  filter: blur(3px) brightness(0.75);
  background-image: url(${({ image }) => image});
  background-size: cover;
  border-radius: 15px;
  margin-top: 15px;

  @media screen and (max-width: 1920px) {
    width: 40%;
  }
`;

const StyledVideoChatButton = styled(Button).attrs({ variant: "dark-outline" })`
  position: absolute;
  z-index: 2;
  cursor: pointer;
  opacity: 0.6;
  transition: color 250ms, opacity 250ms;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-top: 5px;

  &:hover {
    opacity: 1;
  }

  &#closeChat {
    right: 534px;
    color: #b50000;

    svg {
      margin-left: 7px;
    }
  }

  &#openChat {
    right: 5px;
    color: #ffffff;

    svg {
      margin-left: 7px;
    }
  }

  &#closeVideo {
    left: 534px;
    color: #b50000;

    svg {
      margin-right: 7px;
    }
  }

  &#openVideo {
    left: 5px;
    color: #ffffff;

    svg {
      margin-right: 7px;
    }
  }
`;

export const VideoChatButton = ({ id, onClick, children }) => (
  <StyledVideoChatButton id={id} onClick={onClick}>
    {children}
  </StyledVideoChatButton>
);
