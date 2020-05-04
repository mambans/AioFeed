import { Link } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import React, { useState, useContext } from "react";

import { ButtonList } from "./../sharedStyledComponents";
import { Notification, Date, NotificationListContainer } from "./styledComponent";
import { truncate } from "../../util/Utils";
import { UnseenNotifcationCount } from "./../notifications/styledComponent";
import NavigationContext from "./../navigation/NavigationContext";
import NotificationsContext from "./../notifications/NotificationsContext";
import styles from "./Notifications.module.scss";

export default () => {
  const [show, setShow] = useState(false);
  const {
    clearUnseenNotifications,
    unseenNotifications,
    clearNotifications,
    notifications,
  } = useContext(NotificationsContext);
  const { shrinkNavbar } = useContext(NavigationContext);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    clearUnseenNotifications();
  };

  return (
    <>
      <ButtonList
        onClick={handleShow}
        style={{
          border: "none",
          background: "none",
          boxShadow: "none",
          padding: "0",
        }}
        title='Notifications'>
        {unseenNotifications &&
        Array.isArray(unseenNotifications) &&
        unseenNotifications.length > 0 ? (
          <>
            <MdNotifications
              size={shrinkNavbar === "true" ? 35 : 40}
              style={{
                color: "var(--newHighlightColor)",
                alignItems: "center",
                display: "flex",
                transition: "ease-in-out 1s",
              }}
            />
            <UnseenNotifcationCount>{unseenNotifications.length}</UnseenNotifcationCount>
          </>
        ) : (
          <MdNotificationsNone
            size={shrinkNavbar === "true" ? 35 : 40}
            style={{
              alignItems: "center",
              display: "flex",
              ransition: "ease-in-out 1s",
            }}
          />
        )}
      </ButtonList>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
        style={{ minWidth: "unset", maxWidth: "unset" }}>
        <NotificationListContainer>
          <li
            id='clear'
            onClick={() => {
              clearNotifications();
            }}>
            Clear all ({notifications ? notifications.length : 0})
          </li>
          {notifications &&
            notifications.map((item) => {
              return (
                <Notification key={item.key} type={item.status}>
                  <Link
                    to={`/${item.user_name.toLowerCase()}/channel`}
                    className='profileImg'
                    alt=''>
                    <img src={item.profile_img_url} alt=''></img>
                  </Link>
                  <div className='textContainer'>
                    <Link to={`/${item.user_name.toLowerCase()}/channel`} className='name'>
                      <b>{item.user_name}</b> {item.nameSuffix}
                    </Link>
                    <Link to={`/${item.user_name.toLowerCase()}/channel`} className='title'>
                      {item.status === "Updated"
                        ? item.text.split("\n").map((line) => {
                            return (
                              <p className='UpdateText' key={line}>
                                {line}
                              </p>
                            );
                          })
                        : truncate(item.title, 30)}
                    </Link>
                    <Date date={item.date} type={item.status} />
                  </div>
                </Notification>
              );
            })}
        </NotificationListContainer>
      </Modal>
    </>
  );
};
