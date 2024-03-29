import React, { useEffect, useState } from 'react';
// import useClicksOutside from '../../../hooks/useClicksOutside';
import TwitchAPI, { pagination } from '../API';
import { SingelScheduleItem } from '../schedule';
import { RefreshBtn, ScheduleListContainer } from '../schedule/StyledComponents';
import MyModal from '../../../components/mymodal/MyModal';
import { AiFillSchedule } from 'react-icons/ai';

const nrOfItems = 4;

const BigScheduleList = () => {
  const [schedule, setSchedule] = useState();
  // const ref = useRef();
  // const btnRef = useRef();
  // const refreshBtnRef = useRef();
  // const positions = btnRef.current?.getBoundingClientRect();

  // useClicksOutside([ref, btnRef, refreshBtnRef], () => setShow(false), show);

  return (
    <MyModal direction={'left'} position={'left'} relative trigger={<AiFillSchedule size={30} />}>
      <RefreshBtn loading={!schedule} onClick={() => setSchedule()} />

      <SchedulesList setSchedule={setSchedule} schedule={schedule} />
    </MyModal>
  );
};

export default BigScheduleList;

export const SchedulesList = ({ schedule, setSchedule }) => {
  useEffect(() => {
    (async () => {
      const followedChannels = await pagination(
        await TwitchAPI.getMyFollowedChannels({ first: 100 })
      );

      if (!followedChannels?.length) return false;

      const res = await Promise.allSettled(
        await followedChannels.map(async (user) => {
          return await TwitchAPI.getSchedule({ broadcaster_id: user.to_id }).then(
            (res) => res?.data
          );
        })
      );
      const fetchedSchedules = res
        .filter((i) => i?.value?.data?.segments)
        .map((item) =>
          item.value.data?.segments.map((o) => ({
            ...o,
            user: item.value.data.broadcaster_name,
          }))
        );

      const gameIDs = [
        ...new Set(fetchedSchedules.map((channel) => channel.map((i) => i.category?.id)).flat(1)),
      ].filter((l) => l);

      const schedules = await (async () => {
        if (Boolean(gameIDs?.length)) {
          const gameData = await TwitchAPI.getGames({
            id: gameIDs,
          });

          return fetchedSchedules.map((c) => {
            return c.map((s) => {
              if (s.category) {
                s.category['box_art_url'] = gameData?.data?.data?.find(
                  (g) => g.id === s.category?.id
                )['box_art_url'];
              }
              return s;
            });
          });
        }

        return fetchedSchedules;
      })();

      const flattedList = schedules.flat(2);
      const Sortedlist = flattedList
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
        .reverse()
        .filter((i) => new Date(i.start_time).getTime() > Date.now());

      setSchedule(Sortedlist);
    })();
  }, [setSchedule]);

  // return null;

  return (
    <ScheduleListContainer error={schedule?.error} nrOfItemsP={nrOfItems}>
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
};
