import { MdNotifications } from 'react-icons/md';
import { MdNotificationsNone } from 'react-icons/md';
import React, { useContext, useRef } from 'react';

import { UnseenNotifcationCount } from './../notifications/styledComponent';
import NotificationsContext from './../notifications/NotificationsContext';
import NotificationsList from './NotificationsList';
import MyModal from '../../components/mymodal/MyModal';

const Notifications = ({ leftExpandRef }) => {
  const { clearUnseenNotifications, unseenNotifications } = useContext(NotificationsContext);
  const ref = useRef();

  const handleClose = () => {
    leftExpandRef.current.style.removeProperty('width');
    leftExpandRef.current.childNodes[
      leftExpandRef.current.childNodes?.length - 1
    ].style.removeProperty('opacity');
  };
  const handleShow = () => {
    clearUnseenNotifications();
    leftExpandRef.current.style.width = '100%';
    leftExpandRef.current.childNodes[leftExpandRef.current.childNodes?.length - 1].style.opacity =
      '0';
  };

  const triggerRef = ref?.current?.getBoundingClientRect();

  return (
    <>
      <MyModal
        direction='bottom'
        handleOpen={handleShow}
        handleClose={handleClose}
        style={{
          left: triggerRef?.left ? triggerRef?.left + 'px' : 'unset',
          top: triggerRef?.bottom ? triggerRef?.bottom + 'px' : 'unset',
          position: 'fixed',
        }}
        triggerStyle={{ padding: '0 5px', margin: '0 30px' }}
        trigger={
          <div ref={ref}>
            {unseenNotifications?.length > 0 ? (
              <>
                <MdNotifications
                  size={40}
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
                size={40}
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  ransition: 'ease-in-out 1s',
                }}
              />
            )}
          </div>
        }
      >
        <NotificationsList />
      </MyModal>
    </>
  );
};

export default Notifications;
