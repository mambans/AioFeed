import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ToolTip from '../../../components/tooltip/ToolTip';
import { StyledAccountButton } from './StyledComponents';
import { MdModeEdit } from 'react-icons/md';
import useInput from '../../../hooks/useInput';
import styles from './Sidebar.module.scss';

const EditAccount = () => {
  const [open, setOpen] = useState();

  const handleToggle = () => {
    console.log('handleToggle:');

    setOpen((c) => !c);
  };
  const handleClose = () => {
    console.log('handleClose:');
    setOpen(false);
    resetPassword();
    resetNewPassword();
    resetNewPasswordConfirm();
  };

  // eslint-disable-next-line no-unused-vars
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput('');
  // eslint-disable-next-line no-unused-vars
  const { value: newPassword, bind: bindNewPassword, reset: resetNewPassword } = useInput('');
  const {
    // eslint-disable-next-line no-unused-vars
    value: newPasswordConfirm,
    bind: bindNewPasswordConfirm,
    reset: resetNewPasswordConfirm,
  } = useInput('');

  return (
    <>
      <ToolTip tooltip='Edit account'>
        <StyledAccountButton onClick={handleToggle} variant='secondary'>
          Edit account
          <MdModeEdit size={24} style={{ marginLeft: '0.75rem' }} />
        </StyledAccountButton>
      </ToolTip>
      <Modal
        show={open}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
      >
        <Form>
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Current password</Form.Label>
            <Form.Control
              required
              size='lg'
              type='password'
              placeholder='Password'
              {...bindPassword}
            />
            <Form.Control.Feedback type='invalid'>Invalid Password</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='formBasicNewPassword'>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              required
              size='lg'
              type='password'
              placeholder='Enter new password'
              {...bindNewPassword}
            />
            <Form.Control.Feedback type='invalid'>Invalid new password</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='formBasicNewPasswordConfirm' style={{ marginTop: 10 }}>
            <Form.Control
              required
              size='lg'
              type='password'
              placeholder='Enter new password again'
              {...bindNewPasswordConfirm}
            />
            <Form.Control.Feedback type='invalid'>New passwords do not match</Form.Control.Feedback>
          </Form.Group>

          <Button variant='primary' type='submit'>
            Save
          </Button>
        </Form>

        <h2>Edit account</h2>
      </Modal>
    </>
  );
};
export default EditAccount;
