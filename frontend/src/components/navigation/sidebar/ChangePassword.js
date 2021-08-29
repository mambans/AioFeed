import { Form, Button } from 'react-bootstrap';
import { RiLockPasswordLine } from 'react-icons/ri';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useContext } from 'react';

import { DeleteAccountForm, StyledAccountButton } from './StyledComponents';
import AccountContext from './../../account/AccountContext';
import styles from './Sidebar.module.scss';
import useInput from './../../../hooks/useInput';
import Alert from './Alert';
import LoadingIndicator from './../../LoadingIndicator';
import API from '../API';
import { AddCookie } from '../../../util/Utils';
import { toast } from 'react-toastify';

const DeleteAccountButton = () => {
  const { username, authKey, setAuthKey } = useContext(AccountContext);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const [validatedNewPassword, setValidatedNewPassword] = useState(true);

  const handleClose = () => {
    setShow(false);
    resetPassword();
    resetNewPassword();
    setValidated(false);
  };
  const handleShow = () => setShow(true);

  const changePassword = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
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

  return (
    <>
      <StyledAccountButton onClick={handleShow} title='Change password' variant='secondary'>
        <RiLockPasswordLine size={24} />
      </StyledAccountButton>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
      >
        <h2>Change password</h2>
        <div>
          <h4>Enter current password the the new desired password.</h4>
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
            <Form.Label>new Password</Form.Label>
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

          <Button variant='secondary' type='submit' disabled={validated}>
            Change
          </Button>
        </DeleteAccountForm>

        {validated && <LoadingIndicator height={150} width={150} />}
      </Modal>
    </>
  );
};

export default DeleteAccountButton;
