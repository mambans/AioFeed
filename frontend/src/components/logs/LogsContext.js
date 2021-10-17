import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import { GiDominoTiles } from 'react-icons/gi';
import { SiLogstash, SiAuthy } from 'react-icons/si';
import { TransparentButton } from '../sharedComponents/sharedStyledComponents';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import { Date as DateText } from '../notifications/styledComponent';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import ToolTip from '../sharedComponents/ToolTip';
import { FaTwitch, FaYoutube } from 'react-icons/fa';
import { getLocalstorage } from '../../util';

const LOGS_HEIGHT = 600;
const LogsContext = React.createContext();

const LogsButtonIcon = styled(TransparentButton)`
  opacity: 0.75;
  transition: transform 250ms, opacity 250ms;
  padding: 0 10px;
  position: relative;
  user-select: none;
  outline: none;

  * {
    user-select: none;
    outline: none;
  }

  svg {
    color: #ffffff;
  }
  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const Smodal = styled(Modal)`
  /* position: absolute; */
  z-index: 9999;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  padding: 5px;
  max-height: ${LOGS_HEIGHT}px !important;
  height: ${LOGS_HEIGHT}px !important;
  width: 400px !important;
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;
  border-radius: 10px !important;
  overflow: scroll;
  overflow-x: hidden;
  /* padding-right: 10px; */
  margin: 0;
  border: none !important;

  top: 75px;
  left: ${({ left }) => left + 'px'};
  transform: translateX(-100%);
`;

const NrLogs = styled.svg`
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(40%, -40%);
`;

export const Logs = styled.div`
  #clear {
    cursor: pointer;
    display: flex;
    justify-content: center;
    font-weight: bold;
    height: 35px;
    align-items: center;
    color: rgb(150, 150, 150);
    transition: color 250ms;
    position: absolute;
    right: 0;
    top: ${LOGS_HEIGHT - 20}px;
    transform: translateY(-100%);

    &:hover {
      color: rgb(255, 255, 255);
    }
  }
`;

const Log = styled.li`
  display: flex;
  flex-direction: row;
  box-shadow: rgba(0, 0, 0, 0.25) 4px 8px 15px;
  transition: box-shadow 250ms;
  padding: 10px;
  background: rgba(10, 10, 10, 0.95);
  border-radius: 10px;
  margin-bottom: 10px;

  h3 {
    font-size: 1.15em;
  }

  span {
    font-size: 0.9em;
    opacity: 0.85;
  }

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.5) 4px 8px 15px;
    background: rgba(10, 10, 10, 1);
  }
`;

const LogIcon = styled.div`
  padding-right: 10px;
  display: flex;
  align-items: center;
`;

const LogText = styled.div`
  flex-grow: 1;
`;

export const LogsProvider = ({ children }) => {
  const [logs, setLogs] = useSyncedLocalState('logs', []);
  const [logsUnreadCount, setLogsUnreadCount] = useSyncedLocalState('logsUnreadCount', 0);
  const [show, setShow] = useState(false);
  const triggerBtnRef = useRef();
  const updateTimer = useRef();
  const [triggerRefPositions, setTriggerRefPositions] = useState();

  const addLog = useCallback(
    (n) => {
      if (n && Object.prototype.toString.call(n) === '[object Object]') {
        setLogs((c) => {
          return [{ date: new Date().toISOString(), ...(n || {}) }, ...(c || [])].slice(0, 100);
        });
        setLogsUnreadCount((c = 0) => {
          try {
            const parsed = parseInt(JSON.parse(c));
            if (typeof parsed === 'number') {
              return parsed + 1;
            }
            return 1;
          } catch (error) {
            return 1;
          }
        });
      }
    },
    [setLogs, setLogsUnreadCount]
  );

  const handleClose = () => {
    setShow(false);
    setLogsUnreadCount();
  };
  const handleShow = () => {
    setLogs(getLocalstorage('logs'));
    setLogsUnreadCount(getLocalstorage('logsUnreadCount'));
    setShow(true);
  };
  const handleHover = () => setLogsUnreadCount(getLocalstorage('logsUnreadCount'));

  useEffect(() => {
    setTriggerRefPositions(triggerBtnRef?.current?.getBoundingClientRect?.());
    clearInterval(updateTimer.current);
    updateTimer.current = setInterval(
      () => setLogsUnreadCount(getLocalstorage('logsUnreadCount')),
      60 * 10
    );

    return () => clearInterval(updateTimer.current);
  }, [setLogsUnreadCount]);

  const icons = (icon) => {
    switch (icon?.toLowerCase()) {
      case 'twitch':
        return <FaTwitch size={24} color='rgb(169, 112, 255)' />;
      case 'youtube':
        return <FaYoutube size={24} color='rgb(255, 0, 0)' />;
      case 'logout':
        return <FiLogOut size={24} color='rgb(200,50,50)' />;
      case 'login':
        return <FiLogIn size={24} color='rgb(200,50,50)' />;
      case 'authenticated':
        return <SiAuthy size={24} color='rgb(200,50,50)' />;
      default:
        return <GiDominoTiles size={24} />;
    }
  };
  const LogsIcon = (
    <>
      <ToolTip tooltip='Account/"system" logs' delay={{ show: 1000, hide: 0 }}>
        <LogsButtonIcon onClick={handleShow} ref={triggerBtnRef} onMouseEnter={handleHover}>
          <SiLogstash size={24} />
          {logsUnreadCount && (
            <NrLogs height='20' width='20'>
              <text x='0' y='15' fill='white'>
                {logsUnreadCount}
              </text>
            </NrLogs>
          )}
        </LogsButtonIcon>
      </ToolTip>
      <Smodal
        show={show}
        onHide={handleClose}
        left={triggerRefPositions?.left + triggerRefPositions?.width}
      >
        <Logs>
          {logs?.length ? (
            logs?.map(({ title, text, icon, date }, index) => (
              <Log key={String(index)}>
                <LogIcon>{icons(icon)}</LogIcon>
                <LogText>
                  <h3>{title}</h3>
                  <span>{text}</span>
                  <DateText date={date} />
                </LogText>
              </Log>
            ))
          ) : (
            <Log key={'no logs'}>
              <LogIcon>{icons()}</LogIcon>
              <LogText>
                <h3>No logs...</h3>
              </LogText>
            </Log>
          )}
        </Logs>
      </Smodal>
    </>
  );

  return (
    <LogsContext.Provider
      value={{
        logs,
        setLogs,
        addLog,
        LogsIcon,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};

export default LogsContext;