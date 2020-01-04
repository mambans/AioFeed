import React, { useState, useCallback } from "react";
import uniqid from "uniqid";

import NotificationsContext from "./NotificationsContext";

const NotificationProvider = ({ children }) => {
  // const [notificationIndicator, enableNotificationIndicator] = useState(false);
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== null
      ? JSON.parse(localStorage.getItem("notifications"))
      : []
  );
  // const [unseenNotifications, setUnseenNotifications] = useState();

  const [unseenNotifications, setUnseenNotifications] = useState(
    localStorage.getItem("Unseen-notifications") !== "null" &&
      localStorage.getItem("Unseen-notifications") !== "undefined" &&
      localStorage.getItem("Unseen-notifications")
      ? JSON.parse(localStorage.getItem("Unseen-notifications"))
      : []
  );

  const addNotification = useCallback(
    async (noti, status) => {
      await new Promise((resolve, reject) => {
        try {
          // const newNotifications = unseenNotifications ? [...unseenNotifications] : [];
          // const newNotifications = unseenNotifications ? Array.from(unseenNotifications) : [];

          const newNotifications =
            localStorage.getItem("Unseen-notifications") !== "null" &&
            localStorage.getItem("Unseen-notifications") !== "undefined" &&
            localStorage.getItem("Unseen-notifications")
              ? Array.from(JSON.parse(localStorage.getItem("Unseen-notifications")))
              : [];

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
        // setNewNotifications(res.unseenNotifications);
        setUnseenNotifications(res.newNotifications);
        setNotifications(res.notifications);
        localStorage.setItem("Unseen-notifications", JSON.stringify(res.newNotifications));
        localStorage.setItem("notifications", JSON.stringify(res.notifications));
        // enableNotificationIndicator(true);
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
    // enableNotificationIndicator(false);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: notifications,
        addNotification: addNotification,
        clearNotifications: clearNotifications,
        // notificationIndicator: notificationIndicator,
        // enableNotificationIndicator: enableNotificationIndicator,
        unseenNotifications: unseenNotifications,
        setUnseenNotifications: setUnseenNotifications,
        clearUnseenNotifications,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationProvider;
