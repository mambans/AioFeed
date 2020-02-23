import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { MdFormatListBulleted } from "react-icons/md";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import Icon from "react-icons-kit";
import Popup from "reactjs-popup";
import React from "react";
import { FaTwitch } from "react-icons/fa";

import { HeaderContainerTwitchLive, HeaderLeftSubcontainer } from "./styledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../sharedStyledComponents";
import RenderFollowedChannelList from "./channelList/RenderFollowedChannelList";
import Utilities from "../../utilities/Utilities";

export default ({ data, refresh }) => {
  return (
    <HeaderContainerTwitchLive>
      <HeaderLeftSubcontainer>
        <RefreshButton onClick={refresh}>
          {data.refreshing ? (
            <div style={{ height: "24px" }}>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Utilities.loadingSpinnerSmall}
              />
            </div>
          ) : data.autoRefreshEnabled ? (
            data.refreshTimer > new Date().getTime() ? (
              <CountdownCircleTimer
                key={data.refreshTimer}
                isPlaying
                size={24}
                strokeWidth={2.5}
                durationSeconds={Math.round((data.refreshTimer - new Date().getTime()) / 1000)}
                // startAt={
                //   data.refreshTimer > new Date().getTime()
                //     ? 20 - Math.round((data.refreshTimer - new Date().getTime()) / 1000)
                //     : 0
                // }
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
            )
          ) : (
            <Icon
              icon={reload}
              size={24}
              style={{
                position: "relative",
                width: "24px",
                height: "24px",
                margin: "0px auto",
              }}></Icon>
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
        <RenderFollowedChannelList followedChannels={data.followedChannels} />
      </Popup>
    </HeaderContainerTwitchLive>
  );
};
