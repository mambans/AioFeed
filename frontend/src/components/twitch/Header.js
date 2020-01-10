import { list2 } from "react-icons-kit/icomoon/list2";
import { Spinner } from "react-bootstrap";
import { twitch } from "react-icons-kit/fa/twitch";
import Countdown from "react-countdown";
import Icon from "react-icons-kit";
import Popup from "reactjs-popup";
import React from "react";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import {
  HeaderContainerTwitchLive,
  StyledCountdownCircle,
  HeaderLeftSubcontainer,
  //eslint-disable-next-line
  StyledCountdownLine,
} from "./styledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../sharedStyledComponents";
import RenderFollowedChannelList from "./channelList/RenderFollowedChannelList";
import styles from "./Twitch.module.scss";
import Utilities from "../../utilities/Utilities";

export default ({ data, refresh }) => {
  return (
    <HeaderContainerTwitchLive>
      <HeaderLeftSubcontainer>
        <RefreshButton onClick={refresh}>
          {/* {data.refreshing || new Date().getTime() > data.refreshTimer ? ( */}
          {data.refreshing ? (
            <div style={{ height: "24px" }}>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Utilities.loadingSpinnerSmall}
              />
            </div>
          ) : (
            <>
              {/* <StyledCountdownCircle>
                <svg>
                  <circle
                    style={{
                      animationDuration: `${Math.round(
                        data.refreshTimer - new Date().getTime()
                      )}ms`,
                    }}
                    r='10.8'
                    cx='12'
                    cy='12'
                  />
                </svg>
              </StyledCountdownCircle> */}
              {data.refreshTimer > new Date().getTime() ? (
                <CountdownCircleTimer
                  key={data.refreshTimer}
                  isPlaying
                  size={24}
                  strokeWidth={2.5}
                  durationSeconds={
                    data.refreshTimer > new Date().getTime()
                      ? Math.round((data.refreshTimer - new Date().getTime()) / 1000)
                      : 20
                  }
                  colors={[["#ffffff"]]}
                  trailColor={"#rgba(255, 255, 255, 0)"}
                  renderTime={() => {
                    return data.refreshTimer > new Date().getTime()
                      ? Math.round((data.refreshTimer - new Date().getTime()) / 1000)
                      : 20;
                  }}
                />
              ) : (
                ""
              )}
              {/* <StyledCountdownLine>
                <svg
                  style={{
                    animationDuration: `${Math.round(data.refreshTimer - new Date().getTime())}ms`,
                  }}>
                  <line x1='0' y1='0' x2='200' y2='0' />
                </svg>
              </StyledCountdownLine> */}
            </>
          )}
        </RefreshButton>
        <span key={data.refreshTimer} className={styles.refreshTimer}>
          <Countdown
            date={data.refreshTimer}
            zeroPadDays={0}
            zeroPadTime={2}
            key={data.refreshTimer}
            className={styles.refreshTimer}
            precision={1}
          />
          s
        </span>
      </HeaderLeftSubcontainer>
      <HeaderTitle>
        <Icon icon={twitch} size={32} style={{ padding: "0 10px", color: "#6f166f" }}></Icon>
        Twitch Live
      </HeaderTitle>
      <Popup
        placeholder='""'
        arrow={false}
        trigger={
          <div
            style={{
              width: "50px",
              minWidth: "50px",
              marginLeft: "250px",
              justifyContent: "right",
              display: "flex",
            }}>
            <ButtonList>
              <Icon
                icon={list2}
                size={22}
                style={{
                  height: "22px",
                  alignItems: "center",
                  display: "flex",
                }}></Icon>
            </ButtonList>
          </div>
        }
        position='left top'
        className='popupModal'>
        <RenderFollowedChannelList followedChannels={data.followedChannels} />
      </Popup>
    </HeaderContainerTwitchLive>
  );
};
