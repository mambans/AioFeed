import { useContext, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import NotificationsContext from '../../notifications/NotificationsContext';
import { newNonFeedSectionStreamsAtom } from '../atoms';
import loginNameFormat from '../loginNameFormat';
import useFetchSingelVod from '../vods/hooks/useFetchSingelVod';
import addSystemNotification from './addSystemNotification';

const LiveStreamsNotifications = () => {
  const { fetchLatestVod } = useFetchSingelVod();
  const { addNotification } = useContext(NotificationsContext);
  const timer = useRef();
  const invoked = useRef(false);

  const [newNonFeedSectionStreams, setNewNonFeedSectionStreams] = useRecoilState(
    newNonFeedSectionStreamsAtom
  );

  useEffect(() => {
    (async () => {
      try {
        console.log('invoked.current:', invoked.current);
        if (!invoked.current) {
          invoked.current = true;
          return;
        }
        const streams = newNonFeedSectionStreams?.map((s) => {
          const stream = {
            ...s,
            newlyAdded: true,
            notiStatus: 'Live',
            onClick: () =>
              window.open(
                'https://aiofeed.com/' + (stream.login || stream.user_login || stream.user_name)
              ),
          };

          addSystemNotification({
            title: `${loginNameFormat(stream)} is Live`,
            icon: stream?.profile_image_url,
            body: `${stream.title || stream.status || ''}\n${
              stream.game_name || stream.game || ''
            }`,
            onClick: (e) => {
              e.preventDefault();
              window.open('https://aiofeed.com/' + loginNameFormat(stream, true));
            },
          });

          timer.current = setTimeout(
            () => fetchLatestVod?.({ user_id: stream.user_id, check: true }),
            30000
          );

          return stream;
        });

        if (Boolean(streams?.length)) {
          addNotification(streams);
          setNewNonFeedSectionStreams((curr) =>
            curr.filter((s) => !streams.find((st) => st.id === s.id))
          );
        }
      } catch (e) {}
    })();

    return () => {
      // clearTimeout(timer.current);
    };
  }, [fetchLatestVod, newNonFeedSectionStreams, addNotification, setNewNonFeedSectionStreams]);

  return null;
};
export default LiveStreamsNotifications;
