import React, { useCallback, useEffect, useRef } from 'react';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import { GiDominoTiles } from 'react-icons/gi';
import { SiLogstash, SiAuthy } from 'react-icons/si';
import styled from 'styled-components';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import ToolTip from '../../components/tooltip/ToolTip';
import { FaTwitch, FaYoutube, FaTwitter } from 'react-icons/fa';
import { getLocalstorage } from '../../util';
import MyModal from '../../components/mymodal/MyModal';
import NotificationItem from '../notifications/NotificationItem';
import { HiViewList } from 'react-icons/hi';
import { BsCollectionFill } from 'react-icons/bs';
import Colors from '../../components/themes/Colors';

const LogsContext = React.createContext();

const NrLogs = styled.svg`
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(40%, -40%);
`;

export const Logs = styled.div`
  max-height: 600px;
`;

export const LogsProvider = ({ children }) => {
  const [logs, setLogs] = useSyncedLocalState('logs', []);
  const [logsUnreadCount, setLogsUnreadCount] = useSyncedLocalState('logsUnreadCount', 0);
  const triggerBtnRef = useRef();
  const updateTimer = useRef();

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
    setLogsUnreadCount(0);
  };
  const handleShow = () => {
    setLogs(getLocalstorage('logs'));
  };
  const handleHover = () => setLogsUnreadCount(getLocalstorage('logsUnreadCount'));

  useEffect(() => {
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
        return <FaTwitch size={24} color={Colors.purple} />;
      case 'youtube':
        return <FaYoutube size={24} color={Colors.red} />;
      case 'logout':
        return <FiLogOut size={24} color={Colors.red} />;
      case 'login':
        return <FiLogIn size={24} color={Colors.red} />;
      case 'authenticated':
        return <SiAuthy size={24} color={Colors.red} />;
      case 'deleted':
      case 'removed':
        return <SiAuthy size={24} color={Colors.red} />;
      case 'mylist':
        return <HiViewList size={24} color={Colors.green} />;
      case 'feedsection':
        return <BsCollectionFill size={24} color={Colors.green} />;
      case 'twitter':
        return <FaTwitter size={24} color={Colors.green} />;
      default:
        return <GiDominoTiles size={24} />;
    }
  };

  const triggerPos = triggerBtnRef?.current?.getBoundingClientRect?.();
  const LogsIcon = (
    <MyModal
      style={{
        left: triggerPos?.left + triggerPos?.width - 400 || 'unset',
        top: triggerPos?.bottom + triggerPos?.height || 'unset',
        minWidth: '400px',
        position: 'fixed',
      }}
      handleClose={handleClose}
      handleOpen={handleShow}
      onMouseEnter={handleHover}
      direction='down'
      trigger={
        <ToolTip tooltip='Account/"system" logs' delay={{ show: 1000, hide: 0 }}>
          <div ref={triggerBtnRef}>
            <SiLogstash size={24} />
            {!!logsUnreadCount && (
              <NrLogs height='20' width='20'>
                <text x='0' y='15' fill='white'>
                  {logsUnreadCount}
                </text>
              </NrLogs>
            )}
          </div>
        </ToolTip>
      }
    >
      <Logs>
        {logs?.length ? (
          logs?.map(({ title, text, icon, date }, index) => (
            <NotificationItem
              key={String(index)}
              title={title}
              text={text}
              icon={icons(icon)}
              date={date}
              iconWidth='35px'
            />
          ))
        ) : (
          <NotificationItem key={'no logs'} title='No logs...' />
        )}
      </Logs>
    </MyModal>
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
