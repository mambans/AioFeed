import addSystemNotification from "./addSystemNotification";
import { getLocalstorage, truncate } from "../../../util/Utils";

export default async ({
  oldLiveStreams,
  liveStreams,
  newlyAddedStreams,
  setUnseenNotifications,
  isEnabledUpdateNotifications,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      if (!isEnabledUpdateNotifications) reject("Stream 'update' notifications are disabled.");
      const restStreams = liveStreams.current.filter((stream) => {
        return oldLiveStreams.current.find(
          (old_stream) => stream.user_name === old_stream.user_name
        );
      });

      if (restStreams.length <= 0) reject("No new Updated streams");

      resolve(restStreams);
    });

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

        if (oldStreamData.game_name !== stream.game_name && oldStreamData.title !== stream.title) {
          addSystemNotification({
            status: "updated",
            stream: stream,
            changedObj: {
              valueKey: "Title & Game",
              newValue: `${truncate(stream.title, 40)} in ${stream.game_name}`,
              oldValue: `${truncate(oldStreamData.title, 40)} in ${oldStreamData.game_name}`,
            },
            newlyAddedStreams: newlyAddedStreams,
            setUnseenNotifications: setUnseenNotifications,
          });
          stream.status = "Title & Game updated";
          stream.text = `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
            oldStreamData.title,
            40
          )} in ${oldStreamData.game_name}`;
          return stream;
        }
        return null;
      });

      const newGameStreams = UpdateEnabledStreams.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find((old_stream) => {
          return old_stream.user_name === stream.user_name;
        });

        if (oldStreamData.game_name !== stream.game_name && oldStreamData.title === stream.title) {
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

        if (oldStreamData.title !== stream.title && oldStreamData.game_name === stream.game_name) {
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
  } catch (e) {
    return [];
  }
};
