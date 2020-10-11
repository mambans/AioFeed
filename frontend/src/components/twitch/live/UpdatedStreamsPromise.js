import addSystemNotification from './addSystemNotification';
import { truncate } from '../../../util/Utils';

export default async ({
  oldLiveStreams,
  liveStreams,
  newlyAddedStreams,
  setUnseenNotifications,
  isEnabledUpdateNotifications,
  updateNotischannels,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      if (!isEnabledUpdateNotifications) reject("Stream 'update' notifications are disabled.");
      const restStreams = liveStreams.current?.filter((stream) => {
        return oldLiveStreams.current.find(
          (old_stream) => stream.user_name === old_stream.user_name
        );
      });

      if (restStreams?.length <= 0) reject('No new Updated streams');

      resolve(restStreams);
    });

    if (updateNotischannels) {
      const existingStreams = res?.filter((stream) => {
        return oldLiveStreams.current.find((old_stream) => {
          return old_stream.user_name === stream.user_name;
        });
      });

      const updateEnabledStreams = existingStreams?.filter((stream) => {
        return updateNotischannels?.includes(stream.user_name?.toLowerCase());
      });

      const newTitleAndGameStreams = updateEnabledStreams?.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find((old_stream) => {
          return old_stream.user_name === stream.user_name;
        });

        if (oldStreamData.game_name !== stream.game_name && oldStreamData.title !== stream.title) {
          addSystemNotification({
            status: 'Title & Game updated',
            stream: stream,
            body: `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
              oldStreamData.title,
              40
            )} in ${oldStreamData.game_name}`,
            newlyAddedStreams: newlyAddedStreams,
            setUnseenNotifications: setUnseenNotifications,
          });
          stream.notiStatus = 'Title & Game updated';
          stream.text = `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
            oldStreamData.title,
            40
          )} in ${oldStreamData.game_name}`;
          return stream;
        }
        return null;
      });

      const newGameStreams = updateEnabledStreams.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find((old_stream) => {
          return old_stream.user_name === stream.user_name;
        });

        if (oldStreamData.game_name !== stream.game_name && oldStreamData.title === stream.title) {
          addSystemNotification({
            status: 'Game updated',
            stream: stream,
            body: `+ ${truncate(stream.game_name, 40)}\n- ${truncate(oldStreamData.game_name, 40)}`,
            newlyAddedStreams: newlyAddedStreams,
            setUnseenNotifications: setUnseenNotifications,
          });
          stream.notiStatus = 'Game updated';
          stream.text = `+ ${stream.game_name}\n- ${oldStreamData.game_name}`;
          return stream;
        }
        return null;
      });

      const newTitleStreams = updateEnabledStreams.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find((old_stream) => {
          return old_stream.user_name === stream.user_name;
        });

        if (oldStreamData.title !== stream.title && oldStreamData.game_name === stream.game_name) {
          addSystemNotification({
            status: 'Title updated',
            stream: stream,
            body: `+ ${truncate(stream.title, 40)}\n- ${truncate(oldStreamData.title, 40)}`,
            newlyAddedStreams: newlyAddedStreams,
            setUnseenNotifications: setUnseenNotifications,
          });
          stream.notiStatus = 'Title updated';
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
