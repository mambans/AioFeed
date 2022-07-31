import React, { useEffect, useState } from 'react';
import { Modal as ReactModal } from 'react-bootstrap';
import styles from './Modal.module.scss';
import styled from 'styled-components';
import { ScheduleListContainer } from '../../pages/twitch/schedule/StyledComponents';

const Modal = React.forwardRef(({ backdrop = false, children, trigger, show, ...rest }, ref) => {
  const [isOpen, setIsOpen] = useState();

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  return (
    <>
      {trigger && <div onClick={open}>{trigger}</div>}
      <StyledReactModal
        {...rest}
        ref={ref}
        show={isOpen}
        onHide={close}
        dialogClassName={styles.modal}
        backdropClassName={backdrop ? styles.modalBackdrop : ''}
      >
        {children}
      </StyledReactModal>
    </>
  );
});
export default Modal;

const StyledReactModal = styled(ReactModal)`
  ${ScheduleListContainer} {
    width: 100%;
  }
`;
