import React, { useEffect, useState, useRef, useCallback } from "react";
import Popup from "reactjs-popup";
import { Spinner } from "react-bootstrap";
import Icon from "react-icons-kit";
import { twitch } from "react-icons-kit/fa/twitch";
import { reload } from "react-icons-kit/iconic/reload";
import { list2 } from "react-icons-kit/icomoon/list2";

import ErrorHandeling from "../error/Error";
import getFollowedChannels from "./GetFollowedChannels";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import Utilities from "../../utilities/Utilities";
import styles from "./Twitch.module.scss";
import { HeaderContainerTwitchLive } from "./styledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../sharedStyledComponents";

const REFRESH_RATE = 20; // seconds

export default ({ children, ...props }) => {
  const { addNotification } = props.data;
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const followedChannels = useRef([]);
  const liveStreams = useRef([]);
  const oldLiveStreams = useRef([]);
  const newlyAddedStreams = useRef([]);
  const timer = useRef();

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

  const addSystemNotification = useCallback((status, stream) => {
    if (Notification.permission === "granted") {
      let notification = new Notification(
        `${stream.user_name} ${status === "offline" ? "Offline" : "Live"}`,
        {
          body:
            status === "offline"
              ? ""
              : `${Utilities.truncate(stream.title, 60)}\n${stream.game_name}`,
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/icons/v3/Logo-2k.png`,
          silent: status === "offline" ? true : false,
        }
      );

      notification.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        status === "offline"
          ? window.open(
              "https://www.twitch.tv/" + stream.user_name.toLowerCase() + "/videos/" + stream.id,
              "_blank"
            )
          : window.open("https://www.twitch.tv/" + stream.user_name.toLowerCase(), "_blank");
      };

      return notification;
    }
  }, []);

  const refresh = useCallback(async () => {
    // console.log("refreshing");
    setRefreshing(true);
    try {
      setError(null);
      followedChannels.current = await getFollowedChannels();

      const streams = await getFollowedOnlineStreams(followedChannels.current);

      if (streams.status === 200) {
        oldLiveStreams.current = liveStreams.current;
        liveStreams.current = streams.data;
        setRefreshing(false);

        liveStreams.current.forEach(stream => {
          let isStreamLive = oldLiveStreams.current.find(
            ({ user_name }) => user_name === stream.user_name
          );

          if (!isStreamLive) {
            addSystemNotification("online", stream);

            addNotification(stream, "Live");

            newlyAddedStreams.current.push(stream.user_name);
            stream.newlyAdded = true;

            if (document.title.length > 15) {
              const title = document.title.substring(4);
              const count = parseInt(document.title.substring(1, 2)) + 1;
              document.title = `(${count}) ${title}`;
            } else {
              const title = document.title;
              document.title = `(${1}) ${title}`;
            }
          }
        });

        oldLiveStreams.current.forEach(stream => {
          let isStreamLive = liveStreams.current.find(
            ({ user_name }) => user_name === stream.user_name
          );
          if (!isStreamLive) {
            // console.log(stream.user_name, "went Offline.");
            addNotification(stream, "Offline");
          }
        });
      } else if (streams.status === 201) {
        setRefreshing(false);
      }

      setRefreshing(false);
      setIsLoaded(true);
    } catch (error) {
      setError(error);
    }
  }, [addNotification, addSystemNotification]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Twtich Datahandler UseEffect()");
        const timeNow = new Date();
        setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));

        // if (timer.current) clearInterval(timer.current);
        if (!timer.current) {
          console.log("---Twtich Datahandler SetInterval()---");
          timer.current = setInterval(() => {
            const timeNow = new Date();
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
            refresh();
          }, REFRESH_RATE * 1000);
        }
        followedChannels.current = await getFollowedChannels();
        const streams = await getFollowedOnlineStreams(followedChannels.current);
        if (streams.status === 200) {
          liveStreams.current = streams.data;
        } else {
          setError(streams.error);
        }

        setIsLoaded(true);

        // fetchProfileImages(followedChannels.current);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();

    return () => {};
  }, [refresh]);

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  if (!isLoaded) {
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
              {refreshing ? (
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
          </div>
          <HeaderTitle>
            Twitch Live
            <Icon icon={twitch} size={32} style={{ paddingLeft: "10px", color: "#6f166f" }}></Icon>
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
            position='left center'
            className='followedList'>
            <div></div>
          </Popup>
        </HeaderContainerTwitchLive>
        <div
          className={styles.container}
          style={{
            marginTop: "0",
          }}>
          <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
            <span className='sr-only'>Loading...</span>
          </Spinner>
        </div>
      </>
    );
  }
  if (Utilities.getCookie("Twitch-access_token") === null) {
    return (
      <ErrorHandeling
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for Twitch available.",
        }}></ErrorHandeling>
    );
  } else {
    return children({
      liveStreams: liveStreams.current,
      refresh: refresh,
      refreshTimer: refreshTimer,
      newlyAddedStreams: newlyAddedStreams.current,
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      error: error,
      timer: timer.current,
      refreshing: refreshing,
      REFRESH_RATE: REFRESH_RATE,
      setRefreshTimer: setRefreshTimer,
      followedChannels: followedChannels.current,
    });
  }
};
