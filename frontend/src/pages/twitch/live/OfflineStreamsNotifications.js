import moment from 'moment';
import { useContext, useEffect, useRef } from 'react';
import NotificationsContext from '../../notifications/NotificationsContext';
import loginNameFormat from '../loginNameFormat';
import { durationMsToDate } from '../TwitchUtils';
import { TwitchContext } from '../useToken';
import useFetchSingelVod from '../vods/hooks/useFetchSingelVod';
import VodsContext from '../vods/VodsContext';
import addSystemNotification from './addSystemNotification';

const OfflineStreamsNotifications = ({
  liveStreams,
  oldLiveStreams,
  nonFeedSectionLiveStreamsState,
  oldNonFeedSectionsStreams,
}) => {
  const { fetchLatestVod } = useFetchSingelVod();
  const { isEnabledOfflineNotifications } = useContext(TwitchContext);
  const { channels } = useContext(VodsContext);
  const { addNotification } = useContext(NotificationsContext);
  const timer = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = oldLiveStreams.current?.filter(
          (stream) =>
            !liveStreams.find(({ user_id }) => stream.user_id === user_id) &&
            !nonFeedSectionLiveStreamsState.find(({ user_id }) => stream.user_id === user_id) &&
            oldNonFeedSectionsStreams?.find(({ user_id }) => stream.user_id === user_id)
        );

        const streams = res?.map((stream) => {
          stream.notiStatus = 'Offline';
          stream.onClick = () =>
            window.open(
              'https://aiofeed.com/' +
                (stream.login || stream.user_login || stream.user_name) +
                '/page'
            );

          if (isEnabledOfflineNotifications && channels?.includes(String(stream.user_id))) {
            const duration = durationMsToDate(moment().diff(moment(stream.started_at)));

            addSystemNotification({
              title: `${loginNameFormat(stream)} went Offline`,
              icon: stream?.profile_image_url,
              body: `Was live for ${duration}`,
              onClick: (e) => {
                e.preventDefault();
                window.open(
                  `https://aiofeed.com/${
                    stream.login || stream.user_login || stream.user_name
                  }/page`
                );
              },
            });
          }

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
  }, [
    fetchLatestVod,
    liveStreams,
    oldLiveStreams,
    isEnabledOfflineNotifications,
    channels,
    addNotification,
    nonFeedSectionLiveStreamsState,
    oldNonFeedSectionsStreams,
  ]);

  return null;
};
export default OfflineStreamsNotifications;
