import { MdNotifications } from 'react-icons/md';
import { MdNotificationsNone } from 'react-icons/md';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useContext } from 'react';

import { AddToListModalTrigger } from './../sharedComponents/sharedStyledComponents';
import { UnseenNotifcationCount } from './../notifications/styledComponent';
import NavigationContext from './../navigation/NavigationContext';
import NotificationsContext from './../notifications/NotificationsContext';
import styles from './Notifications.module.scss';
import NotificationsList from './NotificationsList';

const Notifications = ({ leftExpandRef }) => {
  const [show, setShow] = useState(false);
  const { clearUnseenNotifications, unseenNotifications } = useContext(NotificationsContext);
  const { shrinkNavbar } = useContext(NavigationContext);

  const handleClose = () => {
    setShow(false);
    leftExpandRef.current.style.removeProperty('width');
    leftExpandRef.current.childNodes[
      leftExpandRef.current.childNodes?.length - 1
    ].style.removeProperty('opacity');
  };
  const handleShow = () => {
    setShow(true);
    clearUnseenNotifications();
    leftExpandRef.current.style.width = '100%';
    leftExpandRef.current.childNodes[leftExpandRef.current.childNodes?.length - 1].style.opacity =
      '0';
  };

  return (
    <>
      <AddToListModalTrigger
        onClick={handleShow}
        style={{
          border: 'none',
          background: 'none',
          boxShadow: 'none',
          padding: '0 5px',
          margin: '0 30px',
        }}
        title='Notifications'
      >
        {unseenNotifications?.length > 0 ? (
          <>
            <MdNotifications
              size={shrinkNavbar === 'true' ? 35 : 40}
              style={{
                color: 'var(--newHighlightColor)',
                alignItems: 'center',
                display: 'flex',
                transition: 'ease-in-out 1s',
              }}
            />
            <UnseenNotifcationCount>
              {unseenNotifications?.length > 100 ? '99+' : unseenNotifications?.length}
            </UnseenNotifcationCount>
          </>
        ) : (
          <MdNotificationsNone
            size={shrinkNavbar === 'true' ? 35 : 40}
            style={{
              alignItems: 'center',
              display: 'flex',
              ransition: 'ease-in-out 1s',
            }}
          />
        )}
      </AddToListModalTrigger>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
        style={{ minWidth: 'unset', maxWidth: 'unset' }}
      >
        <NotificationsList />
      </Modal>
    </>
  );
};

export default Notifications;
