import { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { truncate } from '../../../util';
import NotificationsContext from '../../notifications/NotificationsContext';
import { newUpdatedNonFeedSectionStreamsAtom, previousBaseLiveStreamsAtom } from '../atoms';
import loginNameFormat from '../loginNameFormat';
import { TwitchContext } from '../useToken';
import addSystemNotification from './addSystemNotification';

const UpdateStreamsNotifications = () => {
  const { addNotification } = useContext(NotificationsContext);
  const { isEnabledUpdateNotifications, updateNotischannels } = useContext(TwitchContext);
  const previousStreams = useRecoilValue(previousBaseLiveStreamsAtom);
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
            if (
              stream.title !== stream.oldData?.title &&
              stream.game_id !== stream.oldData?.game_id
            ) {
              addSystemNotification({
                title: `${loginNameFormat(stream)} Title & Game updated`,
                icon: stream?.profile_image_url,
                body: `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
                  stream.oldData?.title,
                  40
                )} in ${stream.oldData?.game_name}`,
                onClick: (e) => {
                  e.preventDefault();
                  window.open(`https://aiofeed.com/${loginNameFormat(stream, true)}`);
                },
              });

              return {
                ...stream,
                notiStatus: 'Title & Game updated',
                text: `+ ${truncate(stream.title, 40)} in ${stream.game_name}\n- ${truncate(
                  stream.oldData?.title,
                  40
                )} in ${stream.oldData?.game_name}`,
                onClick: () => window.open('https://aiofeed.com/' + loginNameFormat(stream, true)),
              };
            }
            if (stream.title !== stream.oldData?.title) {
              addSystemNotification({
                title: `${loginNameFormat(stream)} Title updated`,
                icon: stream?.profile_image_url,
                body: `+ ${truncate(stream.title, 40)}\n- ${truncate(stream.oldData?.title, 40)}`,

                onClick: (e) => {
                  e.preventDefault();
                  window.open(`https://aiofeed.com/${loginNameFormat(stream, true)}`);
                },
              });

              return {
                ...stream,
                notiStatus: 'Title updated',
                text: `+ ${stream.title}\n- ${stream.oldData?.title}`,
                onClick: () => window.open('https://aiofeed.com/' + loginNameFormat(stream, true)),
              };
            }
            if (stream.game_id !== stream.oldData?.game_id) {
              addSystemNotification({
                title: `${loginNameFormat(stream)} Game updated`,
                icon: stream?.profile_image_url,
                body: `+ ${truncate(stream.game_name, 40)}\n- ${truncate(
                  stream.oldData?.game_name,
                  40
                )}`,

                onClick: (e) => {
                  e.preventDefault();
                  window.open(`https://aiofeed.com/${loginNameFormat(stream, true)}`);
                },
              });

              return {
                ...stream,
                notiStatus: 'Game updated',
                text: `+ ${stream.game_name}\n- ${stream.oldData?.game_name}`,
                onClick: () => window.open('https://aiofeed.com/' + loginNameFormat(stream, true)),
              };
            }

            return stream;
          });

        if (Boolean(updatedStreams?.length)) {
          setNewUpdatedNonFeedSectionStreams((curr) =>
            curr.filter((s) => !updatedStreams.find((st) => st.id === s.id))
          );
          addNotification(updatedStreams);
        }
      } catch (e) {}
    })();
  }, [
    previousStreams,
    addNotification,
    isEnabledUpdateNotifications,
    updateNotischannels,
    newUpdatedNonFeedSectionStreams,
    setNewUpdatedNonFeedSectionStreams,
  ]);

  return null;
};
export default UpdateStreamsNotifications;
