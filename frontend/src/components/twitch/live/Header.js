// import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { MdFormatListBulleted } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import Popup from "reactjs-popup";
import React from "react";
import { FaTwitch } from "react-icons/fa";

import { HeaderContainerTwitchLive, HeaderLeftSubcontainer } from "./../StyledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../../sharedStyledComponents";
import RenderFollowedChannelList from "./../channelList/Index";
import Util from "../../../util/Util";
import CountdownCircleTimer from "./CountdownCircleTimer";

export default ({ data, refresh }) => {
  const { refreshing, autoRefreshEnabled, refreshTimer, followedChannels } = data;

  return (
    <HeaderContainerTwitchLive>
      <HeaderLeftSubcontainer>
        <RefreshButton onClick={refresh}>
          {refreshing ? (
            <div className='SpinnerWrapper'>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Util.loadingSpinnerSmall}
              />
            </div>
          ) : autoRefreshEnabled ? (
            <CountdownCircleTimer
              key={refreshTimer}
              startDuration={parseFloat(((refreshTimer - new Date().getTime()) / 1000).toFixed(0))}
              duration={25}
            />
          ) : (
            // <CountdownCircleTimer
            //   key={refreshTimer}
            //   isPlaying
            //   size={24}
            //   strokeWidth={2.5}
            //   durationSeconds={25}
            //   initialRemainingTime={parseFloat(
            //     ((refreshTimer - new Date().getTime()) / 1000).toFixed(0)
            //   )}
            //   colors={[["#ffffff"]]}
            //   trailColor={"#rgba(255, 255, 255, 0)"}
            //   renderTime={() => {
            //     const countdownNr = parseFloat(
            //       ((refreshTimer - new Date().getTime()) / 1000).toFixed(0)
            //     );
            //     return countdownNr > 0 ? countdownNr : 0;
            //   }}
            // />
            <MdRefresh size={34} />
          )}
        </RefreshButton>
      </HeaderLeftSubcontainer>
      <HeaderTitle>
        <FaTwitch size={32} style={{ color: "#6f166f" }} />
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
              <MdFormatListBulleted
                size={22}
                style={{
                  height: "22px",
                  alignItems: "center",
                  display: "flex",
                }}
              />
            </ButtonList>
          </div>
        }
        position='left top'
        className='popupModal'>
        <RenderFollowedChannelList followedChannels={followedChannels} />
      </Popup>
    </HeaderContainerTwitchLive>
  );
};
