import { useContext, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { truncate } from '../../../util';
import NotificationsContext from '../../notifications/NotificationsContext';
import { newUpdatedNonFeedSectionStreamsAtom } from '../atoms';
import loginNameFormat from '../loginNameFormat';
import { TwitchContext } from '../useToken';
import addSystemNotification from './addSystemNotification';

const UpdateStreamsNotifications = () => {
  const { addNotification } = useContext(NotificationsContext);
  const { isEnabledUpdateNotifications, updateNotischannels } = useContext(TwitchContext);
  const [newUpdatedNonFeedSectionStreams, setNewUpdatedNonFeedSectionStreams] = useRecoilState(
    newUpdatedNonFeedSectionStreamsAtom
  );

  useEffect(() => {
    (async () => {
      try {
        if (!isEnabledUpdateNotifications) return null;

        console.log('newUpdatedNonFeedSectionStreams:', newUpdatedNonFeedSectionStreams);
        const updatedStreams = newUpdatedNonFeedSectionStreams
          ?.filter((stream) => updateNotischannels?.includes(stream.user_id))
          ?.map((stream) => {
            const { title, body } = (() => {
              if (
                stream.title !== stream.oldData?.title &&
                stream.game_id !== stream.oldData?.game_id
              ) {
                return {
                  title: `${loginNameFormat(stream)} Title & Game updated`,
                  body: `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
                    stream.oldData?.title,
                    40
                  )} in ${stream.oldData?.game_name}`,
                };
              }

              if (stream.title !== stream.oldData?.title) {
                return {
                  title: `${loginNameFormat(stream)} Title updated`,
                  body: `+ ${truncate(stream.title, 40)}\n- ${truncate(stream.oldData?.title, 40)}`,
                };
              }

              if (stream.game_id !== stream.oldData?.game_id) {
                return {
                  title: `${loginNameFormat(stream)} Game updated`,
                  body: `+ ${truncate(stream.game_name, 40)}\n- ${truncate(
                    stream.oldData?.game_name,
                    40
                  )}`,
                };
              }

              return {};
            })();

            addSystemNotification({
              title,
              icon: stream?.profile_image_url,
              body,
              onClick: (e) => {
                e.preventDefault();
                window.open(`https://aiofeed.com/${loginNameFormat(stream, true)}`);
              },
            });

            return stream;
          });

        if (Boolean(updatedStreams?.length)) {
          addNotification(updatedStreams);
          setNewUpdatedNonFeedSectionStreams((curr) =>
            curr.filter((s) => !updatedStreams.find((st) => st.id === s.id))
          );
        }
      } catch (e) {}
    })();
  }, [
    addNotification,
    isEnabledUpdateNotifications,
    updateNotischannels,
    newUpdatedNonFeedSectionStreams,
    setNewUpdatedNonFeedSectionStreams,
  ]);

  return null;
};
export default UpdateStreamsNotifications;
