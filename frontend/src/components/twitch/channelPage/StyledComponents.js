import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ButtonLookalikeStyle } from '../../sharedComponents/sharedStyledComponents';

export const ChannelContainer = styled.div`
  min-height: 100vh;
  min-width: 100%;
  margin-top: 10px;
`;

export const Banner = styled.div`
  height: 300px;
  margin-bottom: 20px;
`;

export const BannerInfoOverlay = styled.div`
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
  text-shadow: 0px 0px 1px black;

  #HeaderChannelInfo {
    position: relative;
    z-index: 1;
    display: flex;
    flex-flow: column;
    text-align: center;
    border-radius: 15px;
    padding: 10px;
    width: calc(30% - 6px);
    height: calc(100% - 6px);
    margin-top: 15px;

    @media screen and (max-width: 1920px) {
      width: calc(40% - 6px);
    }

    p:not(#name) {
      margin-bottom: 0.6rem;
    }

    h1,
    p,
    a {
      mix-blend-mode: screen;
    }

    .ChannelLiveLink {
      &&& {
        font-size: 2rem;
      }
      color: white;
      padding: 0 10px;
    }

    #title {
      font-size: 1.1rem;
      margin: 0 auto;
    }

    #game {
      color: rgb(240, 240, 240);
      margin-bottom: 0.6rem;
      font-size: inherit;
      padding: 0;
      margin: 0 auto 10px;

      &:hover {
        text-decoration: underline;
      }
    }

    #desc,
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
    }

    #PlaceholderSmallText {
      height: 24px;
      margin-bottom: 1rem;
      width: 100px;
      border-radius: 10px;
      animation: ${pulse} 4s linear infinite;
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

  #partnered {
    height: 25px;
  }

  &:hover {
    #lastUpdate {
      opacity: 1;
    }
  }
`;

export const SubFeedHeader = styled.div`
  display: grid;
  grid-template-areas: 'sort title gap';
  grid-template-columns: 20% auto 20%;
  margin: 20px auto 10px auto;
  border-bottom: 1px solid grey;
  max-width: 100%;

  h3 {
    text-align: center;
    grid-area: title;
  }
`;

export const SortButton = styled(Button).attrs({ variant: 'dark' })`
  width: 200px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  ${ButtonLookalikeStyle}

  svg {
    padding-right: 5px;
  }
`;

export const SortDropDownList = styled.ul`
  position: absolute;
  padding: 10px;
  list-style: none;
  background: var(--popupListsBackground);
  border-radius: 0 0 5px 5px;
  width: 200px;
  border-color: #1d2124;
  box-shadow: 0 0.1rem 0 0.2rem rgba(82, 88, 93, 0.5);
  z-index: 3;

  li,
  a {
    padding: 5px;
    cursor: pointer;
    text-align: center;
    display: block;
    color: var(--textColor1);
    transition: color 250ms, opacity 250ms;
    opacity: 0.8;
    text-transform: capitalize;

    &:hover {
      color: var(--textColor1Hover);
      opacity: 1;
    }
  }
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
  display: flex;
  justify-content: center;
  color: white;
  position: absolute;
  width: 100px;
  transform: translateX(-150px);

  &:hover {
    color: white;
  }

  #LiveDetails {
    display: flex;
    flex-direction: column;
  }

  svg {
    margin-left: 5px;
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
  width: calc(100% - 60px);
  height: inherit;
  filter: blur(3px) brightness(0.75);
  background-image: url(${({ image }) => image});
  background-size: cover;
  border-radius: 15px;
  background-position: center;
  box-shadow: 5px 5px 5px black;
  border: black solid 2px;
`;

const StyledVideoChatButton = styled(Button).attrs({ variant: 'dark-outline' })`
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
    right: 35px;
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
    left: 35px;
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

const breathRedColor = keyframes`
    0% {
      background-color: #ff0000;
    }
    50% {
      background-color: #8a0000;
    }
    100% {
      background-color: #ff0000;
    }
  `;

const breathPurpleBlueColor = keyframes`
    0% {
      border-color: #7309cb;
    }
    50% {
      border-color: #1585b1;
    }
    100% {
      border-color: #7309cb;
    }
  `;

const PurpleBreathAnimation = () => css`
  ${breathPurpleBlueColor} 10s linear 1s infinite;
`;

export const ProfileImage = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  img {
    margin: 0 10px;
    border-radius: 50%;
    border: 5px solid ${({ live }) => (live ? '#8b00ff' : 'transparent')};
    height: 80px;
    animation: ${({ live }) => (live ? PurpleBreathAnimation : 'unset')};

    &::after {
      width: 100%;
      height: 100%;
    }
  }

  div#live {
    color: white;
    background: red;
    border-radius: 7px;
    font-size: 0.9rem;
    font-weight: bold;
    position: absolute;
    width: 55%;
    transform: translateY(-6px);
    animation: ${breathRedColor} 3s linear 1s infinite;
  }
`;

export const NameAndButtons = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  a#name {
    color: white;
    padding: 0 10px;
    font-size: 1.4rem;
    font-weight: 600;
  }

  div.buttonsContainer {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
`;

export const ButtonRow = styled.div`
  color: #ffffff;
  bottom: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;

  #stats {
    display: flex;
    justify-content: center;
    opacity: 0.7;
  }

  p {
    margin: 0 10px;
  }
`;

export const FullDescriptioon = styled.p``;
