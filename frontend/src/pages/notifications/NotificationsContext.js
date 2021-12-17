import React, { useCallback } from 'react';

import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import { getLocalstorage } from '../../util';

const NotificationsContext = React.createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useSyncedLocalState('notifications', []);
  const [unseenNotifications, setUnseenNotifications] = useSyncedLocalState(
    'notificationsUnreadCount',
    []
  );

  const addNotification = useCallback(
    (notis) => {
      if (notis && notis.length) {
        new Promise(async (resolve, reject) => {
          try {
            const notificationsUnreadCount = getLocalstorage('notificationsUnreadCount') || [];
            const existingNotifications = getLocalstorage('notifications') || [];

            const newNotificationsWithAddedProps = await notis?.map((n = {}) => ({
              user_name: n.user_name,
              notiStatus: n.notiStatus,
              profile_image_url: n.profile_image_url,
              text: n.text,
              title: n.title,
              date: n.date || new Date(),
              key: (n.id || n._id) + Date.now() + n.notiStatus,
            }));

            const finalNotifications = [
              ...newNotificationsWithAddedProps,
              ...existingNotifications,
            ].splice(0, 200);

            resolve({
              notifications: finalNotifications,
              notificationsUnreadCount: parseInt(notificationsUnreadCount) + (notis?.length || 0),
            });
          } catch (e) {
            console.log('addNotification() error: ', e);
            reject(e);
          }
        }).then((res) => {
          setTimeout(() => {
            setUnseenNotifications(res.notificationsUnreadCount);
            setNotifications(res.notifications);
          }, 800);
        });
      }
    },
    [setNotifications, setUnseenNotifications]
  );

  const clearUnseenNotifications = useCallback(() => {
    setUnseenNotifications(0);
  }, [setUnseenNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnseenNotifications(0);
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
