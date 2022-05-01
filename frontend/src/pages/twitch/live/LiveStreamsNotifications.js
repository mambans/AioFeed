import { useContext, useEffect, useRef } from 'react';
import NotificationsContext from '../../notifications/NotificationsContext';
import loginNameFormat from '../loginNameFormat';
import useFetchSingelVod from '../vods/hooks/useFetchSingelVod';
import addSystemNotification from './addSystemNotification';

const LiveStreamsNotifications = ({ liveStreams, oldLiveStreams, setNewlyAddedStreams }) => {
  const { fetchLatestVod } = useFetchSingelVod();
  const { addNotification } = useContext(NotificationsContext);
  const timer = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = liveStreams?.filter((stream) => {
          return !oldLiveStreams.current.find(({ user_id }) => stream.user_id === user_id);
        });

        setNewlyAddedStreams((c) => [...(c || []), ...res?.map(({ user_name } = {}) => user_name)]);

        const streams = res?.map((stream) => {
          stream.newlyAdded = true;
          stream.notiStatus = 'Live';
          stream.onClick = () =>
            window.open(
              'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name)
            );

          addSystemNotification({
            title: `${loginNameFormat(stream)} is Live`,
            icon: stream?.profile_image_url,
            body: `${stream.title || stream.status || ''}\n${
              stream.game_name || stream.game || ''
            }`,
            onClick: (e) => {
              e.preventDefault();
              window.open(
                'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name)
              );
            },
          });

          if (fetchLatestVod) {
            timer.current = setTimeout(
              () => fetchLatestVod({ user_id: stream.user_id, check: true }),
              30000
            );
          }

          return stream;
        });

        if (Boolean(streams?.length)) addNotification(streams);
      } catch (e) {}
    })();

    return () => {
      clearTimeout(timer.current);
    };
  }, [fetchLatestVod, liveStreams, oldLiveStreams, setNewlyAddedStreams, addNotification]);

  return null;
};
export default LiveStreamsNotifications;
