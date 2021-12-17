import { Form, Button } from 'react-bootstrap';
import { RiLockPasswordLine } from 'react-icons/ri';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useContext } from 'react';

import { DeleteAccountForm, StyledAccountButton } from './StyledComponents';
import AccountContext from './../../account/AccountContext';
import styles from './Sidebar.module.scss';
import useInput from './../../../hooks/useInput';
import Alert from './Alert';
import LoadingIndicator from '../../../components/LoadingIndicator';
import API from '../API';
import { AddCookie } from '../../../util';
import { toast } from 'react-toastify';
import ToolTip from '../../../components/tooltip/ToolTip';

const DeleteAccountButton = () => {
  const { username, authKey, setAuthKey } = useContext(AccountContext);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const [validatedNewPassword, setValidatedNewPassword] = useState(true);
  const [validatedNewPasswordConfirm, setValidatedNewPasswordConfirm] = useState(true);

  const handleClose = () => {
    setShow(false);
    resetPassword();
    resetNewPassword();
    resetNewPasswordConfirm();
    setValidated(false);
  };
  const handleToggle = () => setShow((c) => !c);

  const changePassword = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      if (newPassword !== newPasswordConfirm) {
        setValidatedNewPasswordConfirm(false);
        setValidated(false);
        return false;
      }
      setValidated(true);
      setValidatedPassword(true);
      setValidatedNewPassword(true);

      await API.changePassword({ username, password, newPassword, authKey })
        .then((res) => {
          if (res.data.authkey) {
            AddCookie('AioFeed_AuthKey', res.data.authkey);
            setAuthKey(res.data.authkey);

            toast.success('Password successfully changed');
          } else {
            toast.error('Something went wrong, try again or relog');
          }
          handleClose();
        })
        .catch((err) => {
          console.error('Error: ', err.response.data.message);
          toast.warning(`${err.response.data.message}`);
          if (err.response.data.message === 'Invalid Password') {
            setValidatedPassword(false);
            resetPassword();
          } else if (err.response.data.message === 'Invalid Authkey') {
            toast.warning(`Try relog and try again`);
            handleClose();
          }
          setValidated(false);
        });
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    changePassword(evt);
  };

  const { value: password, bind: bindPassword, reset: resetPassword } = useInput('');
  const { value: newPassword, bind: bindNewPassword, reset: resetNewPassword } = useInput('');
  const {
    value: newPasswordConfirm,
    bind: bindNewPasswordConfirm,
    reset: resetNewPasswordConfirm,
  } = useInput('');

  return (
    <>
      <ToolTip tooltip='Change password'>
        <StyledAccountButton onClick={handleToggle} variant='secondary'>
          Change password
          <RiLockPasswordLine size={24} style={{ marginLeft: '0.75rem' }} />
        </StyledAccountButton>
      </ToolTip>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
      >
        <h2>Change password</h2>
        <div>
          <h4>Enter current and new password</h4>
        </div>
        <Alert />
        <DeleteAccountForm onSubmit={handleSubmit} validated={validated}>
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Current password</Form.Label>
            <Form.Control
              required
              size='lg'
              type='password'
              placeholder='Password'
              {...bindPassword}
              isInvalid={!validatedPassword}
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
              isInvalid={!validatedNewPassword}
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
              isInvalid={!validatedNewPasswordConfirm}
            />
            <Form.Control.Feedback type='invalid'>New passwords do not match</Form.Control.Feedback>
          </Form.Group>

          <Button variant='primary' type='submit' disabled={validated}>
            Submit
          </Button>
        </DeleteAccountForm>

        {validated && <LoadingIndicator height={150} width={150} />}
      </Modal>
    </>
  );
};

export default DeleteAccountButton;
