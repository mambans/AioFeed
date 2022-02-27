import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { FaRegClock, FaLongArrowAltRight } from 'react-icons/fa';
import { AiFillSchedule } from 'react-icons/ai';
import { BsFillQuestionSquareFill } from 'react-icons/bs';

import {
  StyledSchedule,
  StyledButton,
  ScheduleListContainer,
  CloseOverlay,
  Container,
  RefreshBtn,
  NoSchedulesText,
  nrOfItems,
} from './StyledComponents';
import ToolTip from '../../../components/tooltip/ToolTip';
import TwitchAPI from '../API';
import useClicksOutside from '../../../hooks/useClicksOutside';
import { Portal } from 'react-portal';

const Schedule = ({ user, user_id, alwaysVisible, absolute = true, btnSize = 26, style }) => {
  const [show, setShow] = useState();
  const [schedule, setSchedule] = useState();
  const ref = useRef();
  const btnRef = useRef();
  const refreshBtnRef = useRef();
  const positions = btnRef.current?.getBoundingClientRect();

  useClicksOutside([ref, btnRef, refreshBtnRef], () => setShow(false), show);

  return (
    <>
      <Container absolute={String(absolute)}>
        {!alwaysVisible && (
          <TriggerButton
            setShow={setShow}
            ref={btnRef}
            absolute={String(absolute)}
            btnSize={btnSize}
            style={style}
          />
        )}
        {(show || alwaysVisible) && (
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
              user={user}
              user_id={user_id}
              setSchedule={setSchedule}
              schedule={schedule}
              refreshBtnRef={refreshBtnRef}
              btnRef={btnRef}
            />
          </Portal>
        )}
      </Container>
      {show && (
        <Portal>
          <CloseOverlay id='CloseOverlay' />
        </Portal>
      )}
    </>
  );
};

export const TriggerButton = memo(
  React.forwardRef(({ setShow, absolute, btnSize, style }, ref) => {
    return (
      <ToolTip placement='bottom' tooltip='Show upcoming streams' delay={500}>
        <StyledButton
          absolute={absolute}
          style={style}
          onClick={() => setShow?.((c) => !c)}
          ref={ref}
        >
          <AiFillSchedule size={btnSize} />
        </StyledButton>
      </ToolTip>
    );
  })
);

const SchedulesList = React.forwardRef(({ schedule, setSchedule, user, user_id, style }, ref) => {
  useEffect(() => {
    (async () => {
      if (!schedule) {
        const id =
          user_id ||
          (await TwitchAPI.getUser({
            login: user,
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
  }, [user, user_id, setSchedule, schedule]);
  return (
    <ScheduleListContainer ref={ref} style={style} error={schedule?.error}>
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
        Array.apply(null, Array(nrOfItems)).map((x, i) => {
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
});

export const SingelScheduleItem = ({ schedule, user }) => {
  return (
    <StyledSchedule to={`/${user}`} id='SCHDEULE' loading={String(!schedule)}>
      {schedule && (
        <>
          <div className='time'>
            {schedule?.start_time && (
              <Moment format='M/D/YYYY- h:mm A z' utc local className='start'>
                {schedule.start_time}
              </Moment>
            )}
            {schedule?.end_time && (
              <>
                <FaLongArrowAltRight size={18} />
                <Moment format='M/D/YYYY- h:mm A z' utc local className='end'>
                  {schedule.end_time}
                </Moment>
              </>
            )}
          </div>
          <div>
            <div className='secondTimeRow'>
              <div className='until'>
                <Moment fromNow>{schedule.start_time}</Moment>
              </div>

              {schedule?.end_time && (
                <div className='duration'>
                  <FaRegClock size={12} style={{ marginRight: '5px' }} />
                  <Moment diff={schedule.start_time} unit='hours'>
                    {schedule.end_time}
                  </Moment>
                </div>
              )}
            </div>
          </div>

          <p className='title'>{schedule.title || '...'}</p>

          <Link to={`/category/${schedule?.category?.name}`} className='game'>
            {schedule?.category?.name}
          </Link>

          {user && (
            <Link to={`/${user}`} className='channel'>
              {user}
            </Link>
          )}

          {schedule?.category?.box_art_url ? (
            <img
              className='image'
              src={
                schedule?.category?.box_art_url
                  ?.replace('{width}', 144)
                  ?.replace('{height}', 192) ||
                `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`
              }
              alt=''
            />
          ) : (
            <BsFillQuestionSquareFill className='image' color='rgb(38,38,38)' />
          )}
        </>
      )}
    </StyledSchedule>
  );
};

export default Schedule;
