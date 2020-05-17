import { truncate } from "../../../util/Utils";
import API from "../API";

const markStreamAsSeen = async (streamName, newlyAddedStreams, setUnseenNotifications) => {
  new Promise(async (resolve, reject) => {
    const newUnSeenStreams = await newlyAddedStreams.current.filter((value) => {
      return value !== streamName;
    });

    setUnseenNotifications((unseenNotifications) => {
      const newUnSeenStreams = unseenNotifications.filter((value) => {
        return value !== streamName;
      });
      return newUnSeenStreams;
    });

    resolve(newUnSeenStreams);
  }).then((res) => {
    newlyAddedStreams.current = res;

    if (document.title.length > 15 && res.length > 0) {
      const title = document.title.substring(4);
      const count = parseInt(document.title.substring(1, 2)) - 1;
      document.title = `(${count}) ${title}`;
    } else if (res.length === 0 && document.title !== "AioFeed | Feed") {
      document.title = "AioFeed | Feed";
    }
  });
};

export default async ({
  status,
  stream,
  changedObj,
  newlyAddedStreams,
  setUnseenNotifications,
}) => {
  if (Notification.permission === "granted") {
    if (status === "offline") {
      let notification = new Notification(`${stream.user_name} Offline`, {
        body: "",

        icon: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
        badge: stream.profile_img_url || `${process.env.PUBLIC_URL}/android-chrome-512x512.png`,
        silent: true,
      });

      const vodId = await API.getVideos({
        params: {
          user_id: stream.user_id,
          first: 1,
          type: "archive",
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
        await markStreamAsSeen(stream.user_name, newlyAddedStreams, setUnseenNotifications);
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
        await markStreamAsSeen(stream.user_name, newlyAddedStreams, setUnseenNotifications);
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
        await markStreamAsSeen(stream.user_name, newlyAddedStreams, setUnseenNotifications);
        window.open("https://aiofeed.com/" + stream.user_name.toLowerCase(), "_blank");
      };

      return notification;
    }
  }
};
