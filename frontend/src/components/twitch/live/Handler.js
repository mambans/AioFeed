import React, { useEffect, useState, useRef, useCallback, useContext } from "react";

import ErrorHandler from "../../error";
import GetFollowedChannels from "./../GetFollowedChannels";
import getFollowedOnlineStreams from "./GetFollowedStreams";
import NotificationsContext from "./../../notifications/NotificationsContext";
import AccountContext from "./../../account/AccountContext";
import FeedsContext from "./../../feed/FeedsContext";
import VodsContext from "./../vods/VodsContext";
import FetchSingelChannelVods from "./../vods/FetchSingelChannelVods";
import { AddCookie, getLocalstorage, truncate } from "../../../util/Utils";
import validateToken from "../validateToken";
import addSystemNotification from "./addSystemNotification";

const REFRESH_RATE = 25; // seconds

export default ({ children }) => {
  const { addNotification, setUnseenNotifications } = useContext(NotificationsContext);
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

  const refresh = useCallback(
    async (disableNotifications = false) => {
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
            await Promise.all([
              new Promise((resolve, reject) => {
                const newLive = liveStreams.current.filter((stream) => {
                  return !oldLiveStreams.current.find(
                    ({ user_name }) => stream.user_name === user_name
                  );
                });

                if (newLive.length <= 0) reject("No new LIVE streams");
                resolve(newLive);
              })
                .then((res) => {
                  if (document.title.length > 15) {
                    const title = document.title.substring(4);
                    const count = parseInt(document.title.substring(1, 2)) + res.length;
                    document.title = `(${count}) ${title}`;
                  } else {
                    const title = document.title;
                    document.title = `(${1}) ${title}`;
                  }

                  res.map((stream) => {
                    newlyAddedStreams.current.push(stream.user_name);
                    stream.newlyAdded = true;
                    stream.status = "Live";

                    addSystemNotification({
                      status: "online",
                      stream: stream,
                      newlyAddedStreams: newlyAddedStreams,
                      setUnseenNotifications: setUnseenNotifications,
                    });

                    if (
                      enableTwitchVods &&
                      getLocalstorage("VodChannels").includes(stream.user_name.toLowerCase())
                    ) {
                      setTimeout(async () => {
                        await FetchSingelChannelVods(stream.user_id, setVods);
                      }, 30000);
                    }
                    return "";
                  });
                  return res;
                })
                .catch((e) => {
                  return [];
                }),

              new Promise((resolve, reject) => {
                const newOffline = oldLiveStreams.current.filter((stream) => {
                  return !liveStreams.current.find(
                    ({ user_name }) => stream.user_name === user_name
                  );
                });

                if (newOffline.length <= 0) reject("No new Offline streams");
                resolve(newOffline);
              })
                .then((res) => {
                  res.map((stream) => {
                    stream.status = "Offline";
                    if (
                      isEnabledOfflineNotifications &&
                      getLocalstorage("VodChannels").includes(stream.user_name.toLowerCase())
                    )
                      addSystemNotification({
                        status: "offline",
                        stream: stream,
                        newlyAddedStreams: newlyAddedStreams,
                        setUnseenNotifications: setUnseenNotifications,
                      });

                    if (
                      enableTwitchVods &&
                      getLocalstorage("VodChannels").includes(stream.user_name.toLowerCase())
                    ) {
                      setTimeout(async () => {
                        console.log("Fetching", stream.user_name, "offline vod");
                        await FetchSingelChannelVods(stream.user_id, setVods);
                      }, 0);
                    }
                    return "";
                  });

                  return res;
                })
                .catch((e) => {
                  return [];
                }),

              new Promise((resolve, reject) => {
                if (!isEnabledUpdateNotifications)
                  reject("Stream 'update' notifications are disabled.");
                const restStreams = liveStreams.current.filter((stream) => {
                  return oldLiveStreams.current.find(
                    (old_stream) => stream.user_name === old_stream.user_name
                  );
                });

                resolve(restStreams);
              })
                .then((res) => {
                  if (getLocalstorage("UpdateNotificationsChannels")) {
                    const existingStreams = res.filter((stream) => {
                      return oldLiveStreams.current.find((old_stream) => {
                        return old_stream.user_name === stream.user_name;
                      });
                    });

                    const UpdateEnabledStreams = existingStreams.filter((stream) => {
                      return getLocalstorage("UpdateNotificationsChannels").includes(
                        stream.user_name.toLowerCase()
                      );
                    });

                    const newTitleAndGameStreams = UpdateEnabledStreams.filter((stream) => {
                      const oldStreamData = oldLiveStreams.current.find((old_stream) => {
                        return old_stream.user_name === stream.user_name;
                      });

                      if (
                        oldStreamData.game_name !== stream.game_name &&
                        oldStreamData.title !== stream.title
                      ) {
                        addSystemNotification({
                          status: "updated",
                          stream: stream,
                          changedObj: {
                            valueKey: "Title & Game",
                            newValue: `${truncate(stream.title, 40)} in ${stream.game_name}`,
                            oldValue: `${truncate(oldStreamData.title, 40)} in ${
                              oldStreamData.game_name
                            }`,
                          },
                          newlyAddedStreams: newlyAddedStreams,
                          setUnseenNotifications: setUnseenNotifications,
                        });
                        stream.status = "Title & Game updated";
                        stream.text = `+ ${truncate(stream.title, 40)} in ${
                          stream.game_name
                        }\n- ${truncate(oldStreamData.title, 40)} in ${oldStreamData.game_name}`;
                        return stream;
                      }
                      return null;
                    });

                    const newGameStreams = UpdateEnabledStreams.filter((stream) => {
                      const oldStreamData = oldLiveStreams.current.find((old_stream) => {
                        return old_stream.user_name === stream.user_name;
                      });

                      if (oldStreamData.game_name !== stream.game_name) {
                        addSystemNotification({
                          status: "updated",
                          stream: stream,
                          changedObj: {
                            valueKey: "Game",
                            newValue: stream.game_name,
                            oldValue: oldStreamData.game_name,
                          },
                          newlyAddedStreams: newlyAddedStreams,
                          setUnseenNotifications: setUnseenNotifications,
                        });
                        stream.status = "Game updated";
                        stream.text = `+ ${stream.game_name}\n- ${oldStreamData.game_name}`;
                        return stream;
                      }
                      return null;
                    });

                    const newTitleStreams = UpdateEnabledStreams.filter((stream) => {
                      const oldStreamData = oldLiveStreams.current.find((old_stream) => {
                        return old_stream.user_name === stream.user_name;
                      });

                      if (oldStreamData.title !== stream.title) {
                        addSystemNotification({
                          status: "updated",
                          stream: stream,
                          changedObj: {
                            valueKey: "Title",
                            newValue: stream.title,
                            oldValue: oldStreamData.title,
                          },
                          newlyAddedStreams: newlyAddedStreams,
                          setUnseenNotifications: setUnseenNotifications,
                        });
                        stream.status = "Title updated";
                        stream.text = `+ ${stream.title}\n- ${oldStreamData.title}`;
                        return stream;
                      }
                      return null;
                    });

                    return [newTitleAndGameStreams, newGameStreams, newTitleStreams];
                  }
                })
                .catch((e) => {}),
            ]).then((res) => {
              const flattenedArray = res.flat(3);
              addNotification(flattenedArray);
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
      enableTwitchVods,
      setVods,
      isEnabledUpdateNotifications,
      isEnabledOfflineNotifications,
      setUnseenNotifications,
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
  }, [refresh, autoRefreshEnabled]);

  useEffect(() => {
    return () => {
      console.log("Unmounting");
      clearInterval(timer.current);
    };
  }, []);

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
