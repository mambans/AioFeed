import React, { useEffect, useState, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import Countdown from "react-countdown-now";
import { Spinner } from "react-bootstrap";
import Icon from "react-icons-kit";
import { reload } from "react-icons-kit/iconic/reload";
import { twitch } from "react-icons-kit/fa/twitch";
import Popup from "reactjs-popup";
import { list2 } from "react-icons-kit/icomoon/list2";

import RenderTwitch from "./Render-Twitch";
import styles from "./Twitch.module.scss";
import Utilities from "../../utilities/Utilities";
import RenderFollowedChannelList from "./channelList/RenderFollowedChannelList";
import TwitchSidebar from "./sidebar/TwitchSidebar";

import { HeaderContainerTwitchLive } from "./styledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../sharedStyledComponents";

function Twitch({ data }) {
  // console.log("TCL: Twitch -> data", data.newlyAddedStreams);
  const [show, setShow] = useState(true);
  const [onlineLivestream, setOnlineLivestream] = useState([]);

  const windowFocusHandler = useCallback(() => {
    document.title = "Notifies | Feed";
    // data.refresh();
  }, []);

  const windowBlurHandler = useCallback(() => {
    document.title = "Notifies | Feed";
    data.resetNewlyAddedStreams();
  }, [data]);

  const refresh = useCallback(async () => {
    await data.refresh();
  }, [data]);

  useEffect(() => {
    setOnlineLivestream(data.liveStreams);
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [data.liveStreams, windowBlurHandler, windowFocusHandler]);

  return (
    <>
      <HeaderContainerTwitchLive>
        <div
          style={{
            width: "300px",
            minWidth: "300px",
            alignItems: "end",
            display: "flex",
          }}>
          <RefreshButton onClick={refresh}>
            {data.refreshing ? (
              <div style={{ height: "25.5px" }}>
                <Spinner
                  animation='border'
                  role='status'
                  variant='light'
                  style={Utilities.loadingSpinnerSmall}></Spinner>
              </div>
            ) : (
              <>
                <Icon icon={reload} size={22}></Icon>
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
            />
          </span>
        </div>
        <HeaderTitle>
          Twitch Live <Icon icon={twitch} size={32} style={{ paddingLeft: "10px" }}></Icon>
        </HeaderTitle>
        <Popup
          placeholder='""'
          arrow={false}
          trigger={
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
          }
          position='left top'
          className='popupModal'>
          <RenderFollowedChannelList followedChannels={data.followedChannels} />
        </Popup>
      </HeaderContainerTwitchLive>
      {data.error ? (
        show ? (
          <Alert
            variant='secondary'
            style={Utilities.feedAlertWarning}
            dismissible
            onClose={() => setShow(false)}>
            <Alert.Heading>{data.error}</Alert.Heading>
          </Alert>
        ) : null
      ) : (
        <>
          <TwitchSidebar
            onlineStreams={onlineLivestream}
            newlyAdded={data.newlyAddedStreams}
            REFRESH_RATE={data.REFRESH_RATE}></TwitchSidebar>
          <div
            className={styles.container}
            style={{
              marginTop: "0",
            }}>
            {onlineLivestream.map(stream => {
              return (
                <RenderTwitch
                  data={stream}
                  run={{ initial: data.initialOpen }}
                  newlyAdded={stream.newlyAdded}
                  newlyAddedStreams={data.newlyAddedStreams}
                  refresh={refresh}
                  REFRESH_RATE={data.REFRESH_RATE}
                  key={stream.id}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default Twitch;
