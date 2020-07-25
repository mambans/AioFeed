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
import useEventListener from '../../../hooks/useEventListener';

const StyledNewHighlight = styled.div`
  position: absolute;
  left: 0;
  height: 62px;
  width: 4px;
  border-radius: 2px;
  background: var(--newHighlightColor);
`;

const NewHighlight = ({ newlyAdded, stream }) => {
  if (newlyAdded.includes(stream.user_name)) {
    return <StyledNewHighlight />;
  } else {
    return '';
  }
};

const SidebarItem = ({ stream, newlyAdded, shows, setShows, resetShowsTimer }) => {
  const [showTitle, setShowTitle] = useState();
  const ref = useRef();
  const timerRef = useRef();

  useEventListener('mouseenter', handleMouseOver, ref.current);
  useEventListener('mouseleave', handleMouseOut, ref.current);

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
      to={'/' + stream.user_name.toLowerCase()}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <StyledsidebarItem key={stream.user_id} duration={shows}>
        <NewHighlight newlyAdded={newlyAdded} stream={stream}></NewHighlight>

        <div
          className={'profileImage'}
          // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
        >
          <img
            src={
              stream.profile_img_url
                ? stream.profile_img_url.replace('{width}', 640).replace('{height}', 360)
                : `${process.env.PUBLIC_URL}/android-chrome-512x512.png`
            }
            alt=''
          ></img>
        </div>
        <FirstRow>
          <div
            className={'sidebarUser'}
            // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
          >
            {truncate(stream.user_name, 16)}
          </div>

          <AnimatedViewCount
            className={'sidebarViewers'}
            viewers={stream.viewer_count}
            disabePrefix={true}
          />
        </FirstRow>
        <SecondRow>
          {stream.game_name.length > 15 ? (
            <OverlayTrigger
              key={'bottom'}
              placement={'bottom'}
              delay={{ show: 500, hide: 0 }}
              overlay={
                <Tooltip
                  id={`tooltip-${'bottom'}`}
                  style={{
                    width: '275px',
                  }}
                >
                  {stream.game_name}
                </Tooltip>
              }
            >
              <p className={'sidebarGame'}>{stream.game_name}</p>
            </OverlayTrigger>
          ) : (
            <div
              className={'sidebarGame'}
              // href={"https://www.twitch.tv/" + data.stream.user_name.toLowerCase()}
            >
              <p>{truncate(stream.game_name, 15)}</p>
            </div>
          )}
          <div className={'sidebarDuration'}>
            <Moment interval={1} durationFromNow>
              {stream.started_at}
            </Moment>
            <FaRegClock size={12} />
          </div>
        </SecondRow>
      </StyledsidebarItem>
      <CSSTransition
        in={showTitle}
        key={stream.user_id + stream.title}
        timeout={1000}
        classNames='sidebarInfoPopup'
        unmountOnExit
      >
        <SidebarInfoPopup>
          <div className='borderTop'></div>
          <LiveInfoPopup channel={stream} />
          {/* <span>{stream.title}</span> */}
          <div className='borderBottom'></div>
        </SidebarInfoPopup>
      </CSSTransition>
    </Link>
  );
};

export default SidebarItem;
