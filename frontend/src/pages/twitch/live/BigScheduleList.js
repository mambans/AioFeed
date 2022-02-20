import React, { useEffect, useState } from 'react';
// import useClicksOutside from '../../../hooks/useClicksOutside';
import TwitchAPI from '../API';
import { SingelScheduleItem } from '../schedule';
import { RefreshBtn, ScheduleListContainer } from '../schedule/StyledComponents';
import { fullValidateFunc } from '../validateToken';
import MyModal from '../../../components/mymodal/MyModal';
import { AiFillSchedule } from 'react-icons/ai';

const nrOfItems = 4;

const BigScheduleList = ({ followedChannels }) => {
  const [schedule, setSchedule] = useState();
  // const ref = useRef();
  // const btnRef = useRef();
  // const refreshBtnRef = useRef();
  // const positions = btnRef.current?.getBoundingClientRect();

  // useClicksOutside([ref, btnRef, refreshBtnRef], () => setShow(false), show);

  return (
    <MyModal direction={'left'} position={'left'} relative trigger={<AiFillSchedule size={30} />}>
      <RefreshBtn loading={!schedule} onClick={() => setSchedule()} />

      <SchedulesList
        setSchedule={setSchedule}
        schedule={schedule}
        followedChannels={followedChannels}
      />
    </MyModal>
  );
};

export default BigScheduleList;

const SchedulesList = ({ schedule, setSchedule, followedChannels }) => {
  useEffect(() => {
    (async () => {
      if (!schedule) {
        if (!followedChannels?.length) return false;

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
