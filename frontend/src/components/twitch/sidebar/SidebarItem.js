import { CSSTransition } from 'react-transition-group';
import { FaRegClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React, { useState, useRef } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import styled from 'styled-components';

import { SidebarInfoPopup, StyledsidebarItem, FirstRow, SecondRow } from './StyledComponents';
import { truncate } from '../../../util/Utils';
import AnimatedViewCount from '../live/AnimatedViewCount';
import LiveInfoPopup from '../channelList/LiveInfoPopup';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import loginNameFormat from './../loginNameFormat';

const StyledNewHighlight = styled.div`
  position: absolute;
  left: 0;
  height: 62px;
  width: 4px;
  border-radius: 2px;
  background: var(--newHighlightColor);
`;

const NewHighlight = ({ newlyAdded, user_name }) => {
  if (newlyAdded?.includes(user_name)) {
    return <StyledNewHighlight />;
  } else {
    return '';
  }
};

const SidebarItem = ({ stream, newlyAdded, shows, setShows, resetShowsTimer }) => {
  const {
    user_name,
    user_id,
    profile_image_url,
    viewer_count,
    game_name,
    started_at,
    title,
  } = stream;
  const [showTitle, setShowTitle] = useState();
  const ref = useRef();
  const timerRef = useRef();

  useEventListenerMemo('mouseenter', handleMouseOver, ref.current);
  useEventListenerMemo('mouseleave', handleMouseOut, ref.current);

  function handleMouseOver() {
    setShowTitle(shows);
    timerRef.current = setTimeout(() => {
      setShowTitle(true);
      setShows(true);
    }, 1000);
  }

  function handleMouseOut() {
    clearTimeout(timerRef.current);
    setShowTitle(false);
    clearTimeout(resetShowsTimer.current);
    resetShowsTimer.current = setTimeout(() => {
      setShows(false);
    }, 5000);
  }

  return (
    <Link
      ref={ref}
      to={'/' + user_name?.toLowerCase()}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <StyledsidebarItem key={user_id} duration={shows}>
        <NewHighlight newlyAdded={newlyAdded} user_name={user_name}></NewHighlight>

        <div className={'profileImage'}>
          <img
            src={
              profile_image_url?.replace('{width}', 640)?.replace('{height}', 360) ||
              `${process.env.PUBLIC_URL}/android-chrome-512x512.png`
            }
            alt=''
          ></img>
        </div>
        <FirstRow>
          <div className={'sidebarUser'}>{truncate(loginNameFormat(stream), 16)}</div>

          <AnimatedViewCount
            className={'sidebarViewers'}
            viewers={viewer_count}
            disabePrefix={true}
          />
        </FirstRow>
        <SecondRow>
          {game_name?.length > 15 ? (
            <OverlayTrigger
              key={user_id + 'TitleTooltip'}
              placement={'bottom'}
              delay={{ show: 500, hide: 0 }}
              overlay={
                <Tooltip
                  id={`tooltip-${'bottom'}`}
                  style={{
                    width: '275px',
                  }}
                >
                  {game_name}
                </Tooltip>
              }
            >
              <p className={'sidebarGame'}>{game_name}</p>
            </OverlayTrigger>
          ) : (
            <div className={'sidebarGame'}>
              <p>{truncate(game_name, 15)}</p>
            </div>
          )}
          <div className={'sidebarDuration'}>
            <Moment interval={1} durationFromNow>
              {started_at}
            </Moment>
            <FaRegClock size={12} />
          </div>
        </SecondRow>
      </StyledsidebarItem>
      <CSSTransition
        in={showTitle}
        key={user_id + title}
        timeout={1000}
        classNames='sidebarInfoPopup'
        unmountOnExit
      >
        <SidebarInfoPopup>
          <div className='borderTop'></div>
          <LiveInfoPopup channel={stream} />
          <div className='borderBottom'></div>
        </SidebarInfoPopup>
      </CSSTransition>
    </Link>
  );
};

export default SidebarItem;
