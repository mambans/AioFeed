import moment from 'moment';
import { useContext, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import NotificationsContext from '../../notifications/NotificationsContext';
import {
  baseLiveStreamsAtom,
  newOfflineNonFeedSectionStreamsAtom,
  previousBaseLiveStreamsAtom,
  previousNonFeedSectionStreamsAtom,
} from '../atoms';
import loginNameFormat from '../loginNameFormat';
import { durationMsToDate } from '../TwitchUtils';
import { TwitchContext } from '../useToken';
import { vodChannelsAtom } from '../vods/atoms';
import useFetchSingelVod from '../vods/hooks/useFetchSingelVod';
import addSystemNotification from './addSystemNotification';

const OfflineStreamsNotifications = () => {
  const { fetchLatestVod } = useFetchSingelVod();
  const { isEnabledOfflineNotifications } = useContext(TwitchContext);
  const channels = useRecoilValue(vodChannelsAtom);

  const { addNotification } = useContext(NotificationsContext);
  const liveStreams = useRecoilValue(baseLiveStreamsAtom);
  const [newOfflineNonFeedSectionStreams, setNewOfflineNonFeedSectionStreams] = useRecoilState(
    newOfflineNonFeedSectionStreamsAtom
  );
  const timer = useRef();
  const previousStreams = useRecoilValue(previousBaseLiveStreamsAtom);
  const previousNonFeedsectionStreams = useRecoilValue(previousNonFeedSectionStreamsAtom);

  useEffect(() => {
    (async () => {
      try {
        const streams = newOfflineNonFeedSectionStreams?.map((s) => {
          const stream = {
            ...s,
            notiStatus: 'Offline',
            onClick: () =>
              window.open('https://aiofeed.com/' + loginNameFormat(stream, true) + '/page'),
          };

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

            timer.current = setTimeout(
              () => fetchLatestVod({ user_id: stream.user_id, check: true }),
              30000
            );
          }

          return stream;
        });

        if (Boolean(streams?.length)) {
          addNotification(streams);

          setNewOfflineNonFeedSectionStreams((curr) =>
            curr.filter((s) => !streams.find((st) => st.id === s.id))
          );
        }
      } catch (e) {}
    })();
  }, [
    fetchLatestVod,
    liveStreams,
    previousStreams,
    isEnabledOfflineNotifications,
    channels,
    addNotification,
    newOfflineNonFeedSectionStreams,
    previousNonFeedsectionStreams,
    setNewOfflineNonFeedSectionStreams,
  ]);

  return null;
};
export default OfflineStreamsNotifications;
