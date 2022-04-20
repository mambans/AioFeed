import addSystemNotification from './addSystemNotification';
import { truncate } from '../../../util';
import loginNameFormat from '../loginNameFormat';

const updateSreamsPromise = async ({
  oldLiveStreams,
  liveStreams,
  isEnabledUpdateNotifications,
  updateNotischannels,
}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      if (!isEnabledUpdateNotifications) reject("Stream 'update' notifications are disabled.");
      const restStreams = liveStreams?.filter((stream) =>
        oldLiveStreams.current.find((old_stream) => stream.user_id === old_stream.user_id)
      );

      if (restStreams?.length <= 0) reject('No new Updated streams');

      resolve(restStreams);
    });

    if (updateNotischannels) {
      const existingStreams = res?.filter((stream) =>
        oldLiveStreams.current.find((old_stream) => old_stream.user_name === stream.user_name)
      );

      const updateEnabledStreams = existingStreams?.filter((stream) =>
        updateNotischannels?.includes(stream.user_id)
      );

      const newTitleAndGameStreams = updateEnabledStreams?.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find(
          (old_stream) => old_stream.user_name === stream.user_name
        );

        if (
          oldStreamData?.game_name !== stream?.game_name &&
          oldStreamData.title !== stream.title
        ) {
          addSystemNotification({
            title: `${loginNameFormat(stream)} Title & Game updated`,
            icon: stream?.profile_image_url,
            body: `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
              oldStreamData.title,
              40
            )} in ${oldStreamData.game_name}`,
            onClick: (e) => {
              e.preventDefault();
              window.open(
                `https://aiofeed.com/${stream.login || stream.user_login || stream.user_name}`
              );
            },
          });

          stream.notiStatus = 'Title & Game updated';
          stream.text = `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
            oldStreamData.title,
            40
          )} in ${oldStreamData.game_name}`;
          stream.onClick = () =>
            window.open(
              'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name)
            );

          return stream;
        }
        return null;
      });

      const newGameStreams = updateEnabledStreams.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find(
          (old_stream) => old_stream.user_name === stream.user_name
        );

        if (
          oldStreamData?.game_name !== stream?.game_name &&
          oldStreamData.title === stream.title
        ) {
          addSystemNotification({
            title: `${loginNameFormat(stream)} Game updated`,
            icon: stream?.profile_image_url,
            body: `+ ${truncate(stream.game_name, 40)}\n- ${truncate(oldStreamData.game_name, 40)}`,

            onClick: (e) => {
              e.preventDefault();
              window.open(
                `https://aiofeed.com/${stream.login || stream.user_login || stream.user_name}`
              );
            },
          });

          stream.notiStatus = 'Game updated';
          stream.text = `+ ${stream.game_name}\n- ${oldStreamData.game_name}`;
          stream.onClick = () =>
            window.open(
              'https://aiofeed.com/' + stream.login || stream.user_login || stream.user_name
            );

          return stream;
        }
        return null;
      });

      const newTitleStreams = updateEnabledStreams.filter((stream) => {
        const oldStreamData = oldLiveStreams.current.find(
          (old_stream) => old_stream.user_name === stream.user_name
        );

        if (
          oldStreamData.title !== stream.title &&
          oldStreamData?.game_name === stream?.game_name
        ) {
          addSystemNotification({
            title: `${loginNameFormat(stream)} Title updated`,
            icon: stream?.profile_image_url,
            body: `+ ${truncate(stream.title, 40)}\n- ${truncate(oldStreamData.title, 40)}`,

            onClick: (e) => {
              e.preventDefault();
              window.open(
                `https://aiofeed.com/${stream.login || stream.user_login || stream.user_name}`
              );
            },
          });

          stream.notiStatus = 'Title updated';
          stream.text = `+ ${stream.title}\n- ${oldStreamData.title}`;
          stream.onClick = () =>
            window.open(
              'https://aiofeed.com/' + stream.login || stream.user_login || stream.user_name
            );

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
export default updateSreamsPromise;
