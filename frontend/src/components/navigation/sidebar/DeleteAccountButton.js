import { Form, Button } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useContext } from 'react';

import { DeleteAccountForm, StyledAccountButton } from './StyledComponents';
import AccountContext from './../../account/AccountContext';
import styles from './Sidebar.module.scss';
import useInput from './../../../hooks/useInput';
import NavigationContext from '../NavigationContext';
import Alert from './Alert';
import ClearAllAccountCookiesStates from './ClearAllAccountCookiesStates';
import LoadingIndicator from './../../LoadingIndicator';
import API from '../API';
import { toast } from 'react-toastify';

const DeleteAccountButton = () => {
  const { username, setUsername, setProfileImage, setAuthKey, setEmail, authKey } =
    useContext(AccountContext);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const { setRenderModal } = useContext(NavigationContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteAccount = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === true && account === username) {
      setValidated(true);

      await API.deleteAccount(account, password, authKey)
        .then((res) => {
          if (res) {
            ClearAllAccountCookiesStates({ setUsername, setProfileImage, setAuthKey, setEmail });

            setRenderModal('create');
            toast.success('Account successfully deleted');
          }
        })
        .catch((err) => {
          console.error(err);
          toast.warning(`${err.response.data.message}`);
          setValidated(false);
          resetPassword();
        });
    } else {
      event.preventDefault();
      event.stopPropagation();
      toast.warning(account + ' is Invalid Username');
      console.log(account + ' is Invalid Username');
    }
  };

  const handleSubmit = (evt) => {
    console.log(account);
    evt.preventDefault();
    deleteAccount(evt);
  };

  // eslint-disable-next-line no-unused-vars
  const { value: account, bind: bindAccount, reset: resetAccount } = useInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput('');

  return (
    <>
      <StyledAccountButton
        color='hsla(0, 65%, 28%, 1)'
        onClick={handleShow}
        title='Delete account'
        variant='danger'
      >
        <MdDelete size={24} />
      </StyledAccountButton>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
      >
        <h2>Delete Account</h2>
        <div>
          <h4>Enter account name and password to delete</h4>
        </div>
        <Alert />
        <DeleteAccountForm onSubmit={handleSubmit} validated={validated}>
          <Form.Group controlId='formBasicUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              size='lg'
              type='text'
              placeholder='Enter Username'
              {...bindAccount}
              isInvalid={account !== username}
            />
            <Form.Control.Feedback type='invalid'>Invalid Username</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              size='lg'
              type='password'
              placeholder='Password'
              {...bindPassword}
              isInvalid={!password}
            />
            <Form.Control.Feedback type='invalid'>Invalid Password</Form.Control.Feedback>
          </Form.Group>

          <Button variant='danger' type='submit' disabled={account !== username || validated}>
            Delete
          </Button>
        </DeleteAccountForm>

        {validated && <LoadingIndicator height={150} width={150} />}
      </Modal>
    </>
  );
};

export default DeleteAccountButton;
