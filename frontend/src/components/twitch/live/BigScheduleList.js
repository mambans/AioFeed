import React, { useEffect, useRef, useState } from 'react';
import { Portal } from 'react-portal';
import useClicksOutside from '../../../hooks/useClicksOutside';
import BackDrop from '../../sharedComponents/BackDrop';
import TwitchAPI from '../API';
import { SingelScheduleItem, TriggerButton } from '../schedule';
import { RefreshBtn, ScheduleListContainer } from '../schedule/StyledComponents';
import { fullValidateFunc } from '../validateToken';

const nrOfItems = 4;

const BigScheduleList = ({ followedChannels }) => {
  const [show, setShow] = useState();
  const [schedule, setSchedule] = useState();
  const ref = useRef();
  const btnRef = useRef();
  const refreshBtnRef = useRef();
  const positions = btnRef.current?.getBoundingClientRect();

  useClicksOutside([ref, btnRef, refreshBtnRef], () => setShow(false), show);

  return (
    <>
      <TriggerButton setShow={setShow} ref={btnRef} btnSize={30} style={{ marginRight: '15px' }} />
      {show && (
        <Portal>
          <RefreshBtn
            ref={refreshBtnRef}
            loading={!schedule}
            onClick={() => setSchedule()}
            style={{
              top: positions.bottom,
              left: Math.max(0, positions?.left),
            }}
          />
          <SchedulesList
            style={{
              position: 'absolute',
              top: positions.bottom,
              left: Math.max(0, positions?.left - (420 - positions?.width)),
            }}
            ref={ref}
            setSchedule={setSchedule}
            schedule={schedule}
            followedChannels={followedChannels}
          />
          <BackDrop transparent />
        </Portal>
      )}
    </>
  );
};

export default BigScheduleList;

const SchedulesList = React.forwardRef(
  ({ schedule, setSchedule, style, followedChannels }, ref) => {
    useEffect(() => {
      (async () => {
        if (!schedule) {
          if (!followedChannels.length) return false;

          const fetchedSchedules = await fullValidateFunc().then(async () => {
            const res = await Promise.all(
              followedChannels.map(async (user) => {
                return await TwitchAPI.getSchedule(
                  { broadcaster_id: user.to_id },
                  { skipValidation: true }
                );
              })
            );
            const list = res
              .filter((i) => i && i?.data?.data?.segments)
              .map((item) =>
                item.data.data?.segments.map((o) => ({
                  ...o,
                  user: item.data.data.broadcaster_name,
                }))
              );
            const gameIDs = [
              ...new Set(list.map((channel) => channel.map((i) => i.category?.id)).flat(1)),
            ].filter((l) => l);

            if (Boolean(gameIDs?.length)) {
              const gameData = await TwitchAPI.getGames({
                id: gameIDs,
              });

              return list.map((c) => {
                return c.map((s) => {
                  if (s.category) {
                    s.category['box_art_url'] = gameData?.data?.data?.find(
                      (g) => g.id === s.category?.id
                    )['box_art_url'];

                    return s;
                  }
                  return s;
                });
              });
            }
            return await list;
          });

          const flattedList = fetchedSchedules.flat(2);
          const Sortedlist = flattedList
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
            .reverse()
            .filter((i) => new Date(i.start_time).getTime() > Date.now());

          setSchedule(Sortedlist);
        }
      })();
    }, [followedChannels, setSchedule, schedule]);

    // return null;

    return (
      <ScheduleListContainer ref={ref} style={style} error={schedule?.error} nrOfItemsP={nrOfItems}>
        {schedule
          ? schedule?.map((i, index) => (
              <React.Fragment key={index}>
                <SingelScheduleItem schedule={i} user={i.user} key={i.id} />
                <br />
              </React.Fragment>
            ))
          : Array.apply(null, Array(nrOfItems)).map((x, i) => {
              return (
                <React.Fragment key={i}>
                  <SingelScheduleItem />
                  <br />
                </React.Fragment>
              );
            })}
      </ScheduleListContainer>
    );
  }
);
