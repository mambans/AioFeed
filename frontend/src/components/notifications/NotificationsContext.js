import React, { useCallback } from 'react';

import useSyncedLocalState from './../../hooks/useSyncedLocalState';
import { getLocalstorage } from '../../util';

const NotificationsContext = React.createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useSyncedLocalState('notifications', []);
  const [unseenNotifications, setUnseenNotifications] = useSyncedLocalState(
    'Unseen-notifications',
    []
  );

  const addNotification = useCallback(
    (notis) => {
      if (notis) {
        new Promise(async (resolve, reject) => {
          try {
            const oldUnseenNotifications = getLocalstorage('Unseen-notifications') || [];
            const existingNotifications = getLocalstorage('notifications') || [];
            const toAddUnseenUsernames = notis?.map((stream) => stream?.user_name);
            const newUnseenNotifications = [...oldUnseenNotifications, ...toAddUnseenUsernames];

            const newNotificationsWithAddedProps = await notis?.map((n) => ({
              ...n,
              date: new Date(),
              key: (n.id || n._id) + Date.now() + n.notiStatus,
            }));

            const finalNotifications = [
              ...newNotificationsWithAddedProps,
              ...existingNotifications,
            ].splice(0, 100);

            resolve({ notifications: finalNotifications, newUnseenNotifications });
          } catch (e) {
            console.log('addNotification() error: ', e);
            reject(e);
          }
        }).then((res) => {
          setTimeout(() => {
            setUnseenNotifications(res.newUnseenNotifications);
            setNotifications(res.notifications);
          }, 800);
        });
      }
    },
    [setNotifications, setUnseenNotifications]
  );

  const clearUnseenNotifications = useCallback(() => {
    setUnseenNotifications([]);
  }, [setUnseenNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnseenNotifications([]);
  }, [setNotifications, setUnseenNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        unseenNotifications,
        setUnseenNotifications,
        clearUnseenNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
