import { Button } from 'react-bootstrap';
import { GrOfflineStorage } from 'react-icons/gr';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';

import { StyledAccountButton } from './StyledComponents';
import Alert from './Alert';
import { toast } from 'react-toastify';
import styles from './Sidebar.module.scss';
import ToolTip from '../../sharedComponents/ToolTip';
import styled from 'styled-components';

const StyledIcon = styled(GrOfflineStorage)`
  margin-left: 0.75rem;
  path {
    stroke: #ffffff;
  }
`;

const ClearAllLocalstorage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleToggle = () => setShow((c) => !c);
  const clearLocalstorage = () => {
    localStorage.clear();
    setShow(false);
    toast.success('Localstorage cleared');
  };

  return (
    <>
      <ToolTip tooltip='Clear all localstorage incase you got some weird problems'>
        <StyledAccountButton onClick={handleToggle} variant='secondary'>
          Clear localstorage
          <StyledIcon size={24} />
        </StyledAccountButton>
      </ToolTip>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
      >
        <h2>Clear localstorage</h2>
        <h4>Delete all localstorage for this site?</h4>
        <ul>
          {Object.keys(localStorage)?.map((key) => (
            <li style={{ textAlign: 'center' }}>{key}</li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant='danger' onClick={clearLocalstorage}>
            Clear all (yes)
          </Button>
          <Button variant='secondary' onClick={handleClose}>
            Cancel (no)
          </Button>
        </div>
        <Alert />
      </Modal>
    </>
  );
};

export default ClearAllLocalstorage;
