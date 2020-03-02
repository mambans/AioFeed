import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { MdFormatListBulleted } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import Popup from "reactjs-popup";
import React from "react";
import { FaTwitch } from "react-icons/fa";

import { HeaderContainerTwitchLive, HeaderLeftSubcontainer } from "./styledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../sharedStyledComponents";
import RenderFollowedChannelList from "./channelList/RenderFollowedChannelList";
import Utilities from "../../utilities/Utilities";

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
                style={Utilities.loadingSpinnerSmall}
              />
            </div>
          ) : autoRefreshEnabled ? (
            refreshTimer > new Date().getTime() ? (
              <CountdownCircleTimer
                key={refreshTimer}
                isPlaying
                size={24}
                strokeWidth={2.5}
                durationSeconds={Math.round((refreshTimer - new Date().getTime()) / 1000)}
                // startAt={
                //   data.refreshTimer > new Date().getTime()
                //     ? 20 - Math.round((data.refreshTimer - new Date().getTime()) / 1000)
                //     : 0
                // }
                colors={[["#ffffff"]]}
                trailColor={"#rgba(255, 255, 255, 0)"}
                renderTime={() => {
                  return refreshTimer > new Date().getTime()
                    ? Math.round((refreshTimer - new Date().getTime()) / 1000)
                    : 20;
                }}
              />
            ) : (
              ""
            )
          ) : (
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
