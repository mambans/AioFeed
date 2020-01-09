import styled from "styled-components";

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

  div {
    background: #5a5c5e;
    height: 2px;
  }

  p {
    width: max-content;
    cursor: pointer;
    margin: 0;
    font-weight: bold;
    color: #a4a4a4;
    text-shadow: 0px 0px 5px black;
    padding: 10px 20px;

    &:hover {
      color: white;
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

const StyledCountdownLine = styled.div`
  svg {
    height: 4px;
    width: 200px;
    animation: countdown2 20s linear 1 forwards;

    line {
      stroke: rgb(255, 0, 0);
      stroke-width: 4;
    }
  }

  @keyframes countdown2 {
    from {
      width: 200px;
    }
    to {
      width: 0px;
    }
  }
`;

const HeaderLeftSubcontainer = styled.div`
  width: 300px;
  min-width: 300px;
  align-items: end;
  display: flex;
`;

export {
  HeaderContainerTwitchLive,
  StyledLoadmore,
  StyledCountdownCircle,
  HeaderLeftSubcontainer,
  StyledCountdownLine,
};
