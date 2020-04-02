import React, { useState, useCallback } from "react";
import uniqid from "uniqid";
import Util from "../../util/Util";

const NotificationsContext = React.createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(Util.getLocalstorage("notifications") || []);

  const [unseenNotifications, setUnseenNotifications] = useState(
    Util.getLocalstorage("Unseen-notifications") || []
  );

  const addNotification = useCallback(
    async (noti, status) => {
      await new Promise((resolve, reject) => {
        try {
          const newNotifications = Util.getLocalstorage("Unseen-notifications") || [];

          newNotifications.push(noti);

          const existingNotifications = notifications || [];
          noti.date = new Date();
          noti.key = uniqid(noti.id, new Date().getTime()) + status;
          noti.status = status;

          existingNotifications.unshift(noti);

          if (existingNotifications && existingNotifications.length > 50)
            existingNotifications.splice(49);

          resolve({ notifications: existingNotifications, newNotifications });
        } catch (e) {
          console.log("addNotification error", e);
          reject(e);
        }
      }).then(res => {
        setUnseenNotifications(res.newNotifications);
        setNotifications(res.notifications);
        localStorage.setItem("Unseen-notifications", JSON.stringify(res.newNotifications));
        localStorage.setItem("notifications", JSON.stringify(res.notifications));
      });
    },
    [notifications]
  );

  const clearUnseenNotifications = useCallback(() => {
    localStorage.setItem("Unseen-notifications", JSON.stringify(null));
    setUnseenNotifications(null);
  }, []);

  const clearNotifications = useCallback(() => {
    localStorage.setItem("Unseen-notifications", JSON.stringify([]));
    localStorage.setItem("notifications", JSON.stringify([]));

    setNotifications([]);
    setUnseenNotifications([]);
  }, []);

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
