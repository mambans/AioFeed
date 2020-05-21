import styled from "styled-components";
import { Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

export const RefreshButton = styled(Button).attrs({ variant: "outline-secondary" })`
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  position: relative;
  left: 6px;
  align-items: center;
  transition-duration: 250ms;

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
    border: var(--refreshButtonHoverBorder);
  }
`;

export const ButtonList = styled(Button).attrs({ variant: "outline-secondary" })`
  display: flex;
  position: relative;
  color: var(--refreshButtonColor);
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border: var(--refreshButtonBorder);
  font-weight: bold;
  align-items: center;
  transition-duration: 250ms;

  &:hover {
    background: var(--refreshButtonHoverBackground);
    color: var(--refreshButtonHoverColor);
    border: var(--refreshButtonHoverBorder);
  }
`;

export const HeaderTitle = styled.h4`
  text-align: center;
  color: var(--textColor2);
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
  /* margin-top: 25px; */
  height: 50.5px;
  width: 100%;
`;

export const SubFeedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* padding-bottom: 50px; */
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

  box-shadow: var(--videoBoxShadow);
  border-radius: 10px;
  background-color: var(--videoContainerBackgroundColor);

  a {
    .channelContainer {
      display: grid;
      height: 26px;
      align-content: center;
      margin-bottom: 5px;
      grid-template-columns: min-content;
      width: inherit;

      .profile_img {
        width: 26px;
        border-radius: 3px;
      }

      &:hover {
        button,
        svg {
          opacity: 1;
        }
      }
      a {
        font-size: 1rem !important;
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    .game {
      color: var(--textColor2);
    }

    &:hover {
      color: var(--textColor2Hover);
    }
  }
`;

export const ChannelContainer = styled.div`
  display: grid;
  height: 26px;
  align-content: center;
  margin-bottom: 5px;
  grid-template-columns: min-content;
  width: inherit;

  .profileImg {
    width: 26px;
    border-radius: 3px;
  }

  .channelName {
    padding: 0 5px;
    font-weight: bold;
    color: var(--textColor2);
    grid-row: 1;
    width: max-content;
    transition: color 250ms;
    /* mix-blend-mode: screen; */
  }

  &:hover {
    button,
    svg {
      opacity: 1;
    }
  }

  a {
    font-size: 1rem !important;
    height: 100%;
    display: flex;
    align-items: center;
  }
`;

export const GameContainer = styled.div`
  display: grid;
  grid-template-columns: 10% 50% 40%;
  width: 336px;
  align-items: center;
  min-height: 34px;
  transition: color 250ms;
  /* mix-blend-mode: screen; */

  .gameImg {
    width: 26px;
    border-radius: 3px;
    grid-column: 1;
    object-fit: cover;
    padding: 0;
  }

  .gameName {
    padding-left: 5px;
    grid-column: 2;
    bottom: 20px;
    background: none;
    padding-right: 5px;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 250ms;
    color: var(--textColor2);
  }

  .viewers {
    color: var(--textColor1);
    position: relative;
    display: flex;
    justify-content: flex-end;
    grid-column: 3;
    padding-right: 10px;
    margin-bottom: 0;
    align-items: center;

    svg {
      color: rgb(200, 200, 200);
      padding-left: 5px;
      padding-top: 3px;
      display: flex;
      align-items: center;
    }
  }
`;

export const VideoTitle = styled(Link)`
  color: var(--textColor1);
  margin-top: 15px;
  margin-bottom: 5px;
  grid-area: title;
  font-size: 1.1rem;
  max-width: 336px;
  overflow: hidden;
  height: 45px;
  line-height: 1.2;
  padding: 0;
  /* mix-blend-mode: screen; */

  &:hover {
    color: var(--textColor1Hover);
    mix-blend-mode: unset;
  }
`;

export const VideoTitleHref = styled.a`
  color: var(--textColor1);
  margin-top: 15px;
  margin-bottom: 5px;
  grid-area: title;
  font-size: 1.1rem;
  max-width: 336px;
  overflow: hidden;
  height: 45px;
  line-height: 1.2;
  padding: 0;
  /* mix-blend-mode: screen; */

  &:hover {
    color: var(--textColor1Hover);
    mix-blend-mode: unset;
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
    transition: opacity 200ms 0ms;
    opacity: 0;
  }

  img {
    border-radius: 10px;
    width: 100%;
    /*  width: 336px; */
    max-height: 189px;
    object-fit: cover;
  }

  &:hover {
    z-index: 2;
    transform: scale(1.15);
    box-shadow: 0 0px 0px 0px #be0e0e00, 0 0px 0px 0px #be0e0e00,
      12px 0 50px -4px rgba(0, 0, 0, 0.8), -12px 0 50px -4px rgba(0, 0, 0, 0.8);

    .loadingSpinner {
      transition-delay: 800ms;
      opacity: 0.5;
    }

    .error {
      opacity: 1;
    }

    time {
      z-index: 1;
    }
  }

  .duration {
    position: relative;
    width: max-content;
    background: #2222228c;
    padding-right: 5px;
    font-size: 0.9rem;
    padding-left: 5px;
    z-index: 1;
    height: 24px;
    bottom: 28px;
    left: 4px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    background: #161616b0;
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

export const VodAddRemoveButton = styled(Button).attrs({ variant: "link" })`
  color: rgb(200, 200, 200);
  grid-row: 1;
  justify-self: right;
  padding: 0px;
  opacity: ${({ loweropacity }) => loweropacity || 1};
  margin-right: ${({ marginright }) => marginright || "unset"};
  opacity: 0;
  transition: opacity 250ms;

  &:hover {
    color: ${({ vodenabled }) => (vodenabled === "true" ? "rgb(225, 000, 000)" : "#14ae14")};
    opacity: 1;
  }
`;

// export const VodAddButton = styled(Button).attrs({ variant: "link" })`
//   color: rgb(200, 200, 200);
//   grid-row: 1;
//   justify-self: right;
//   padding: 0px;
//   margin-right: ${({ marginright }) => marginright || "unset"};
//   opacity: 0;
//   transition: opacity 250ms;

//   &:hover {
//     color: #14ae14;
//     opacity: 1;
//   }
// `;

export const StyledLoadingContainer = styled.div`
  display: grid;
  justify-content: center;
  transition: all 2s linear ease-in;

  h1 {
    color: #dddddd;
    text-align: center;
  }
`;

export const VodVideoInfo = styled.div`
  bottom: 30px;
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  align-items: center;
  height: 30px;

  .vodDuration {
    width: max-content;
    background: #2222228c;
    padding-right: 5px;
    padding-left: 5px;
    background: #161616b0;
    margin: 0;
    margin-left: 3px;
    border-radius: 12px;
    height: 24px;
    display: flex;
    align-items: center;
    z-index: 1;
  }

  .view_count {
    width: max-content;
    padding-right: 5px;
    padding-left: 5px;
    background: #161616b0;
    margin: 0;
    margin-right: 3px;
    border-radius: 12px;
    height: 24px;
    display: flex;
    align-items: center;
  }
`;

export const StyledVideoElementAlert = styled(Alert)`
  text-align: center;
  padding: 3px;
  position: absolute;
  width: 100%;
  border-radius: 10px 10px 0 0;
  transition: opacity 250ms;
  opacity: 0;
`;
