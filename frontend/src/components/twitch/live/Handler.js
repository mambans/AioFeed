import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import axios from "axios";

import ErrorHandler from "../../error";
import GetFollowedChannels from "./../GetFollowedChannels";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import NotificationsContext from "./../../notifications/NotificationsContext";
import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import VodsContext from "./../vods/VodsContext";
import FetchSingelChannelVods from "./../vods/FetchSingelChannelVods";
import { AddCookie, getCookie, getLocalstorage, truncate } from "../../../util/Utils";
import validateToken from "../validateToken";

const REFRESH_RATE = 25; // seconds

export default ({ children }) => {
  const addNotification = useContext(NotificationsContext).addNotification;
  const { autoRefreshEnabled, twitchToken } = useContext(AccountContext);
  const { setVods } = useContext(VodsContext);
  const {
    enableTwitchVods,
    isEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
  } = useContext(FeedsContext);
  const [refreshTimer, setRefreshTimer] = useState(20);
  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    error: null,
    loaded: false,
  });
  const followedChannels = useRef([]);
  const liveStreams = useRef();
  const oldLiveStreams = useRef([]);
  const newlyAddedStreams = useRef([]);
  const timer = useRef();

  const windowFocusHandler = useCallback(() => {
    document.title = "AioFeed | Feed";
    resetNewlyAddedStreams();
  }, []);

  const windowBlurHandler = useCallback(() => {
    if (document.title !== "AioFeed | Feed") document.title = "AioFeed | Feed";
    resetNewlyAddedStreams();
  }, []);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("focus", windowFocusHandler);
      window.removeEventListener("blur", windowBlurHandler);
    };
  }, [windowBlurHandler, windowFocusHandler]);

  function resetNewlyAddedStreams() {
    newlyAddedStreams.current = [];
  }

  const markStreamAsSeen = async (streamName) => {
    const unSeenStreams = [...newlyAddedStreams.current];

    const index = unSeenStreams.indexOf(streamName);

    if (index !== -1) {
      const newUnSeenStreams = unSeenStreams.splice(index, 1);

      newlyAddedStreams.current = newUnSeenStreams;

      if (document.title.length > 15 && newUnSeenStreams.length > 0) {
        const title = document.title.substring(4);
        const count = parseInt(document.title.substring(1, 2)) - 1;
        document.title = `(${count}) ${title}`;
      } else if (newUnSeenStreams.length === 0 && document.title !== "AioFeed | Feed") {
        document.title = "AioFeed | Feed";
      }
    }
  };

  const addSystemNotification = useCallback(async (status, stream, changedObj) => {
    if (Notification.permission === "granted") {
      if (status === "offline") {
        let notification = new Notification(`${stream.user_name} Offline`, {
          body: "",

          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          silent: true,
        });

        const vodId = await axios
          .get(`https://api.twitch.tv/helix/videos?`, {
            params: {
              user_id: stream.user_id,
              first: 1,
              type: "archive",
            },
            headers: {
              Authorization: `Bearer ${getCookie("Twitch-access_token")}`,
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            },
          })
          .then((res) => {
            return res.data.data[0];
          })
          .catch((error) => {
            console.error(error);
          });

        notification.onclick = async function (event) {
          event.preventDefault(); // prevent the browser from focusing the Notification's tab
          await markStreamAsSeen();
          window.open("https://www.twitch.tv/videos/" + vodId.id, "_blank");
        };
        return notification;
      } else if (status === "online") {
        let notification = new Notification(`${stream.user_name} Live`, {
          body: `${truncate(stream.title, 60)}\n${stream.game_name}`,
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          silent: false,
        });

        notification.onclick = async function (event) {
          event.preventDefault(); // prevent the browser from focusing the Notification's tab
          await markStreamAsSeen();
          window.open("https://aiofeed.com/" + stream.user_name.toLowerCase(), "_blank");
        };

        return notification;
      } else if (status === "updated") {
        let notification = new Notification(`${stream.user_name} ${changedObj.valueKey} updated`, {
          body: `+ ${truncate(changedObj.newValue, 60)}\n- ${truncate(changedObj.oldValue, 60)}`,
          icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
          silent: false,
        });

        notification.onclick = async function (event) {
          event.preventDefault(); // prevent the browser from focusing the Notification's tab
          await markStreamAsSeen();
          window.open("https://aiofeed.com/" + stream.user_name.toLowerCase(), "_blank");
        };

        return notification;
      }
    }
  }, []);

  const refresh = useCallback(
    async (disableNotifications) => {
      // console.log("refreshing");
      setLoadingStates(({ loaded }) => {
        return { refreshing: true, error: null, loaded: loaded };
      });
      try {
        // followedChannels.current = await getFollowedChannels(parseInt(twitchUserId));
        // followedChannels.current = await GetFollowedChannels();
        followedChannels.current = await validateToken().then((res) => {
          return GetFollowedChannels();
        });

        if (followedChannels.current && followedChannels.current[0]) {
          AddCookie("Twitch-username", followedChannels.current[0].from_name);
        }
        const streams = await getFollowedOnlineStreams(followedChannels.current);

        if (streams.status === 200) {
          // setError(null);
          oldLiveStreams.current = liveStreams.current;
          liveStreams.current = streams.data;
          setLoadingStates({
            refreshing: false,
            error: null,
            loaded: true,
          });

          if (!disableNotifications) {
            liveStreams.current.forEach((stream) => {
              const alreadyLive = oldLiveStreams.current.find(
                ({ user_name }) => user_name === stream.user_name
              );

              if (!alreadyLive) {
                addSystemNotification("online", stream);
                addNotification(stream, "Live");

                if (
                  enableTwitchVods &&
                  getLocalstorage("VodChannels").includes(stream.user_name.toLowerCase())
                ) {
                  setTimeout(async () => {
                    await FetchSingelChannelVods(stream.user_id, setVods);
                  }, 30000);
                }

                newlyAddedStreams.current.push(stream.user_name);
                stream.newlyAdded = true;

                // if (document.visibilityState !== "visible") {
                if (document.title.length > 15) {
                  const title = document.title.substring(4);
                  const count = parseInt(document.title.substring(1, 2)) + 1;
                  document.title = `(${count}) ${title}`;
                } else {
                  const title = document.title;
                  document.title = `(${1}) ${title}`;
                }
                // }
              } else if (
                isEnabledUpdateNotifications &&
                getLocalstorage("UpdateNotificationsChannels") &&
                getLocalstorage("UpdateNotificationsChannels").includes(
                  stream.user_name.toLowerCase()
                )
              ) {
                const oldStreamData = oldLiveStreams.current.find((old_stream) => {
                  return old_stream.user_name === stream.user_name;
                });

                if (oldStreamData && stream) {
                  if (
                    oldStreamData.game_name !== stream.game_name &&
                    oldStreamData.title !== stream.title
                  ) {
                    addSystemNotification("updated", stream, {
                      valueKey: "Title & Game",
                      newValue: `${truncate(stream.title, 40)} in ${stream.game_name}`,
                      oldValue: `${truncate(oldStreamData.title, 40)} in ${
                        oldStreamData.game_name
                      }`,
                    });
                  } else if (oldStreamData.game_name !== stream.game_name) {
                    addSystemNotification("updated", stream, {
                      valueKey: "Game",
                      newValue: stream.game_name,
                      oldValue: oldStreamData.game_name,
                    });
                  } else if (oldStreamData.title !== stream.title) {
                    addSystemNotification("updated", stream, {
                      valueKey: "Title",
                      newValue: stream.title,
                      oldValue: oldStreamData.title,
                    });
                  }
                }
              }
            });

            oldLiveStreams.current.forEach((stream) => {
              const isStreamLive = liveStreams.current.find(
                ({ user_name }) => user_name === stream.user_name
              );
              if (
                !isStreamLive &&
                isEnabledOfflineNotifications &&
                enableTwitchVods &&
                getLocalstorage("VodChannels").includes(stream.user_name.toLowerCase())
              ) {
                addSystemNotification("offline", stream);
                addNotification(stream, "Offline");

                setTimeout(async () => {
                  console.log("Fetching", stream.user_name, "offline vod");
                  await FetchSingelChannelVods(stream.user_id, setVods);
                }, 0);
              }
            });
          }
        } else if (streams.status === 201) {
          // setError(streams.error);
          setLoadingStates({
            refreshing: false,
            error: streams.error,
            loaded: true,
          });
        }
      } catch (error) {
        // setError(error);
        setLoadingStates({
          refreshing: false,
          error: error,
          loaded: true,
        });
      }
    },
    [
      addNotification,
      addSystemNotification,
      enableTwitchVods,
      setVods,
      isEnabledUpdateNotifications,
      isEnabledOfflineNotifications,
    ]
  );

  useEffect(() => {
    (async () => {
      try {
        const timeNow = new Date();
        if (!timer.current) {
          if (autoRefreshEnabled) {
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
          }
          await refresh(true);
          // setIsLoaded(true);
        }

        if (autoRefreshEnabled && !timer.current) {
          console.log("---SetInterval Twitch live timer.---");
          timer.current = setInterval(() => {
            const timeNow = new Date();
            setRefreshTimer(timeNow.setSeconds(timeNow.getSeconds() + REFRESH_RATE));
            refresh();
          }, REFRESH_RATE * 1000);
        } else if (!autoRefreshEnabled && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
          // setIsLoaded(true);
          setLoadingStates({ refreshing: false, loaded: true, error: null });
        }
      } catch (error) {
        // setError(error);
        setLoadingStates({ refreshing: false, error: error, loaded: true });
      }
    })();

    // const refreshTimer = timer.current;

    return () => {
      console.log("Unmounting");
      clearInterval(timer.current);
    };
  }, [refresh, autoRefreshEnabled]);

  if (!twitchToken) {
    return (
      <ErrorHandler
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for Twitch available.",
        }}
      />
    );
  } else {
    return children({
      refreshing: loadingStates.refreshing,
      loaded: loadingStates.loaded,
      refreshTimer: refreshTimer,
      followedChannels: followedChannels.current,
      error: loadingStates.error,
      liveStreams: liveStreams.current || [],
      resetNewlyAddedStreams: resetNewlyAddedStreams,
      refresh: refresh,
      newlyAddedStreams: newlyAddedStreams.current,
      REFRESH_RATE: REFRESH_RATE,
      autoRefreshEnabled: autoRefreshEnabled,
    });
  }
};
