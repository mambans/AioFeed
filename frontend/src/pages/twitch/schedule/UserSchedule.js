import React, { useEffect, useState } from 'react';
import { SingelScheduleItem } from '.';
import TwitchAPI from '../API';
import loginNameFormat from '../loginNameFormat';
import { NoSchedulesText, ScheduleListContainer } from './StyledComponents';

const UserSchedule = ({ user, amount = 10 }) => {
  console.log('UserSchedule user:', user);
  const [schedule, setSchedule] = useState();

  useEffect(() => {
    (async () => {
      if (!schedule) {
        const id =
          user.user_id ||
          (await TwitchAPI.getUser({
            login: loginNameFormat(user, true),
          }).then((res) => res.data.data[0].id));

        const fetchedSchedule = await TwitchAPI.getSchedule({ broadcaster_id: id }).catch((e) => {
          console.error('fetchedSchedule error:', e);
          setSchedule({ error: 'No schedule available' });
        });
        const gameIds =
          [...new Set(fetchedSchedule?.data?.data?.segments.map((i) => i.category?.id))] || [];

        if (Boolean(gameIds?.filter((i) => i).length)) {
          const gameData = await TwitchAPI.getGames({
            id: gameIds,
          });

          fetchedSchedule.data.data.segments.map(
            (s) =>
              (s.category['box_art_url'] = gameData?.data?.data?.find(
                (g) => g.id === s.category?.id
              )['box_art_url'])
          );
        }

        if (fetchedSchedule?.data?.data?.segments?.[0]) {
          setSchedule(fetchedSchedule.data);
        } else {
          setSchedule({ error: 'No schedule available' });
        }
      }
    })();
  }, [user, schedule]);
  return (
    <ScheduleListContainer error={schedule?.error}>
      {schedule?.data?.segments ? (
        schedule.data.segments.map((i, index) => (
          <React.Fragment key={index}>
            <SingelScheduleItem schedule={i} user={user} key={i.id} />
            <br />
          </React.Fragment>
        ))
      ) : schedule?.error ? (
        <NoSchedulesText>{schedule?.error}</NoSchedulesText>
      ) : (
        Array.apply(null, Array(amount)).map((x, i) => {
          return (
            <React.Fragment key={i}>
              <SingelScheduleItem />
              <br />
            </React.Fragment>
          );
        })
      )}
    </ScheduleListContainer>
  );
};

export default UserSchedule;
