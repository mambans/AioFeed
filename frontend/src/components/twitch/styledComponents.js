import styled, { keyframes } from "styled-components";
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";

const HeaderContainerTwitchLive = styled.div`
  border-bottom: var(--subFeedHeaderBorder);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
  width: var(--feedsWidth) !important;
  margin: var(--feedsMargin);

  @media screen and (max-width: 2560px) {
    margin: 25px 0 0 360px;
    width: 82%;
  }

  @media screen and (max-width: 1920px) {
    width: 73.5%;
    margin: 25px 7.5% 0 19%;
  }
`;

const StyledLoadmore = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto min-content auto;
  align-items: center;
  max-width: 100%;

  div {
    background: rgba(90, 92, 94, 0.67);
    height: 1px;
  }

  p {
    width: max-content;
    cursor: pointer;
    margin: 0;
    font-weight: bold;
    color: #a4a4a4;
    /* text-shadow: 0px 0px 5px black; */
    padding: 0px 15px;
    transition: all 200ms;

    &:hover {
      color: white;
      padding: 0px 25px;
    }
  }
`;

const StyledCountdownCircle = styled.div`
  position: relative;
  margin: auto;
  height: 24px;
  width: 24px;
  text-align: center;

  div {
    color: white;
    display: inline-block;
    line-height: 24px;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }

  svg circle {
    stroke-dasharray: 67.8px;
    /* stroke-dasharray: 113px; */
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 3px;
    stroke: white;
    fill: none;
    animation: countdown 20s linear 1 forwards;
  }

  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 67.8px;
      /* stroke-dashoffset: 113px; */
    }
  }
`;

const HeaderLeftSubcontainer = styled.div`
  width: 300px;
  min-width: 300px;
  align-items: end;
  display: flex;
`;

const pulse = keyframes`
  0% {background: #131416d1;}
  40% {background: #1f2024d1;}
  100% {background: #131416d1;}
`;

const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

const StyledLoadingBox = styled.div`
  display: grid;
  grid-template-areas: "video video" "title title" "info info";
  width: 336px;
  margin: 7px;
  max-height: 336px;
  margin-bottom: 15px;
  /* height: ${({ type }) => (type === "Vods" || type === "Clips" ? "unset" : "334px")}; */
  height: unset;

  transition: all 1s linear;

  div#video {
    grid-area: video;
    max-height: 189px;
    min-height: 189px;
    width: 336px;
    border-radius: 10px;
    background: #131416d1;
    animation: ${pulse} 2s linear infinite;
  }

  div div {
    background: #131416d1;
    border-radius: 10px;
  }

  div#title {
    color: var(--videoTitle);
    margin-top: 15px;
    margin-bottom: 5px;
    grid-area: title;
    font-size: 1.1rem;
    max-width: 336px;
    overflow: hidden;
    height: 45px;
    line-height: 1.2;

    div {
      width: 200px;
      height: 20px;
    }
  }

  #details {
    height: ${({ type }) => (type === "Vods" ? "65px" : type === "Clips" ? "25px" : "75px")};
    /* height: 65px; */

    #channel {
      width: 100px;
      /* height: 20px; */
      height: ${({ type }) => (type === "Clips" ? "25px" : "20px")};
      /* margin: 7px 0; */
      margin: ${({ type }) => (type === "Clips" ? "0" : "7px 0")};
    }

    #game {
      width: 125px;
      height: 20px;
      margin: 21px 0 0 0;
      display: ${({ type }) => (type === "Clips" ? "none" : "block")};
    }
  }
`;

const StyledLoadingList = styled.ul`
  li div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
  }
`;

const FollowBtn = styled(MdFavoriteBorder)`
  cursor: pointer;
  color: red;
  transition: color 250ms;
  margin: 0 10px;

  &:hover {
    color: green;
  }
`;

const UnfollowBtn = styled(MdFavorite)`
  cursor: pointer;
  color: green;
  transition: color 250ms;
  margin: 0 10px;

  &:hover {
    color: red;
  }
`;

export {
  HeaderContainerTwitchLive,
  StyledLoadmore,
  StyledCountdownCircle,
  HeaderLeftSubcontainer,
  StyledLoadingBox,
  StyledLoadingList,
  FollowBtn,
  UnfollowBtn,
};
