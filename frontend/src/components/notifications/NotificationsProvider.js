import React, { useState } from "react";
import uniqid from "uniqid";

import NotificationsContext from "./NotificationsContext";

const NotificationProvider = ({ children }) => {
  const [notificationIndicator, enableNotificationIndicator] = useState(false);
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== null
      ? JSON.parse(localStorage.getItem("notifications"))
      : []
  );

  const addNotification = async (noti, status) => {
    await new Promise((resolve, reject) => {
      try {
        const existingNotifications = notifications;
        noti.date = new Date();
        noti.key = uniqid(noti.id);
        noti.status = status;

        existingNotifications.unshift(noti);
        if (existingNotifications.length > 50) existingNotifications.splice(49);

        resolve(existingNotifications);
      } catch (e) {
        console.log("addNotification error", e);
        reject(e);
      }
    }).then(res => {
      localStorage.setItem("notifications", JSON.stringify(res));
      setNotifications(res);
      enableNotificationIndicator(true);
    });
  };

  const clearNotifications = () => {
    console.log("Clearing Notifications");

    setNotifications([]);
    localStorage.setItem("notifications", null);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications: notifications,
        addNotification: addNotification,
        clearNotifications: clearNotifications,
        notificationIndicator: notificationIndicator,
        enableNotificationIndicator: enableNotificationIndicator,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationProvider;
