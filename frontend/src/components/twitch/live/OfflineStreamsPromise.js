import addSystemNotification from "./addSystemNotification";
import FetchSingelChannelVods from "./../vods/FetchSingelChannelVods";
import { getLocalstorage } from "../../../util/Utils";

export default async ({
  oldLiveStreams,
  liveStreams,
  isEnabledOfflineNotifications,
  newlyAddedStreams,
  setUnseenNotifications,
  enableTwitchVods,
  setVods,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      const newOffline = oldLiveStreams.current.filter((stream) => {
        return !liveStreams.current.find(({ user_name }) => stream.user_name === user_name);
      });

      if (newOffline.length <= 0) reject("No new Offline streams");
      resolve(newOffline);
    });

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
  } catch (e) {
    return [];
  }
};
