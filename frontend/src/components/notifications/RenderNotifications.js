import { ic_notifications_active } from "react-icons-kit/md/ic_notifications_active";
import { ic_notifications_none } from "react-icons-kit/md/ic_notifications_none";
import Icon from "react-icons-kit";
import Modal from "react-bootstrap/Modal";
import Moment from "react-moment";
import React, { useState, useContext } from "react";

import "./Notifications.scss";
import { ButtonList } from "./../sharedStyledComponents";
import { Notification } from "./styledComponent";
import { UnseenNotifcationCount } from "./../notifications/styledComponent";
import NotificationsContext from "./../notifications/NotificationsContext";
import styles from "./Notifications.module.scss";
import Utilities from "../../utilities/Utilities";

export default () => {
  const [show, setShow] = useState(false);
  const props = useContext(NotificationsContext);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    props.clearUnseenNotifications();
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
        }}>
        {props.unseenNotifications &&
        Array.isArray(props.unseenNotifications) &&
        props.unseenNotifications.length > 0 ? (
          <>
            <Icon
              icon={ic_notifications_active}
              size={40}
              style={{
                color: "var(--newHighlight)",
                height: "22px",
                alignItems: "center",
                display: "flex",
                transition: "ease-in-out 1s",
              }}></Icon>
            <UnseenNotifcationCount>{props.unseenNotifications.length}</UnseenNotifcationCount>
          </>
        ) : (
          <Icon
            icon={ic_notifications_none}
            size={40}
            style={{
              alignItems: "center",
              display: "flex",
              ransition: "ease-in-out 1s",
            }}></Icon>
        )}
      </ButtonList>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
        style={{ minWidth: "unset", maxWidth: "unset" }}>
        <div>
          <ul>
            <li
              onClick={() => {
                props.clearNotifications();
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                fontWeight: "bold",
                height: "47px",
                alignItems: "center",
              }}>
              Clear all ({props.notifications ? props.notifications.length : 0})
            </li>
            {props.notifications
              ? props.notifications.map(item => {
                  return (
                    <Notification key={item.key}>
                      <a
                        className='profileImg'
                        href={"https://www.twitch.tv/" + item.user_name.toLowerCase()}
                        alt=''>
                        <img src={item.profile_img_url} alt=''></img>
                      </a>
                      <a
                        href={"https://www.twitch.tv/" + item.user_name.toLowerCase()}
                        alt=''
                        className='name'>
                        <b>{item.user_name}</b> went {item.status}
                      </a>
                      <a
                        href={"https://www.twitch.tv/" + item.user_name.toLowerCase() + "/videos"}
                        className='title'>
                        {Utilities.truncate(item.title, 50)}
                      </a>
                      <Moment fromNow className='date'>
                        {item.date}
                      </Moment>
                    </Notification>
                  );
                })
              : null}
          </ul>
        </div>
      </Modal>
    </>
  );
};
