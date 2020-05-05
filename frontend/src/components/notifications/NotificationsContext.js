import React, { useCallback } from "react";
import uniqid from "uniqid";
import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

const NotificationsContext = React.createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useSyncedLocalState("notifications", []);
  const [unseenNotifications, setUnseenNotifications] = useSyncedLocalState(
    "Unseen-notifications",
    []
  );

  const addNotification = useCallback(
    async (noti, status, nameSuffix, text) => {
      await new Promise(async (resolve, reject) => {
        try {
          const oldNotifications = [...unseenNotifications];
          const usernames = noti.map((stream) => {
            return stream.user_name;
          });

          const newNotifications = oldNotifications.concat(usernames);
          const existingNotifications = [...notifications];

          await noti.map((n) => {
            n.date = new Date();
            n.key = uniqid(n.id, new Date().getTime()) + status;
            n.status = status;
            n.nameSuffix = nameSuffix;
            n.text = text;

            existingNotifications.unshift(n);

            return "";
          });

          if (existingNotifications && existingNotifications.length > 101)
            existingNotifications.splice(100);

          resolve({ notifications: existingNotifications, newNotifications });
        } catch (e) {
          console.log("addNotification error", e);
          reject(e);
        }
      }).then((res) => {
        setTimeout(() => {
          setUnseenNotifications(res.newNotifications);
          setNotifications(res.notifications);
        }, 800);
      });
    },
    [notifications, setNotifications, setUnseenNotifications, unseenNotifications]
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
        notifications: notifications,
        addNotification: addNotification,
        clearNotifications: clearNotifications,
        unseenNotifications: unseenNotifications,
        setUnseenNotifications: setUnseenNotifications,
        clearUnseenNotifications,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
