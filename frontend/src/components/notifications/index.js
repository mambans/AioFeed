import { MdNotifications } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Moment from "react-moment";
import moment from "moment";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { ButtonList } from "./../sharedStyledComponents";
import { Notification } from "./styledComponent";
import { UnseenNotifcationCount } from "./../notifications/styledComponent";
import NotificationsContext from "./../notifications/NotificationsContext";
import NavigationContext from "./../navigation/NavigationContext";
import styles from "./Notifications.module.scss";
import Util from "../../util/Util";

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
        <div>
          <ul>
            <li
              onClick={() => {
                clearNotifications();
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                fontWeight: "bold",
                height: "47px",
                alignItems: "center",
              }}>
              Clear all ({notifications ? notifications.length : 0})
            </li>
            {notifications &&
              notifications.map((item) => {
                return (
                  <Notification key={item.key} type={item.status}>
                    <Link
                      to={`/channel/${item.user_name.toLowerCase()}`}
                      className='profileImg'
                      alt=''>
                      <img src={item.profile_img_url} alt=''></img>
                    </Link>
                    <Link to={`/channel/${item.user_name.toLowerCase()}`} alt='' className='name'>
                      <b>{item.user_name}</b> went {item.status}
                    </Link>
                    {item.status === "Live" && (
                      <Link to={`/channel/${item.user_name.toLowerCase()}`} className='title'>
                        {Util.truncate(item.title, 50)}
                      </Link>
                    )}
                    <div className='date'>
                      <div>
                        <Moment fromNow id='timeago'>
                          {item.date}
                        </Moment>
                        <p id='time'>{moment(item.date).format("MM-DD HH:mm")}</p>
                      </div>
                    </div>
                  </Notification>
                );
              })}
          </ul>
        </div>
      </Modal>
    </>
  );
};
