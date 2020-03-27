import { Form, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import React, { useState, useContext } from "react";

import { DeleteAccountForm, DeleteAccountFooter, DeleteAccountButton } from "./StyledComponent";
import { AccountContext } from "./../../account/AccountContext";
import styles from "./Sidebar.module.scss";
import useInput from "./../../useInput";

export default () => {
  const { username } = useContext(AccountContext);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const deleteAccount = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === true && account === username) {
      // console.log("Deleted account " + account);
      setValidated(true);

      // await axios
      //   .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/delete`, {
      //     username: account,
      //     password: password,
      //   })
      //   .then(res => {
      //     console.log("TCL: deleteAccount -> res", res);
      //   })
      //   .catch(err => {
      //     console.error(err);
      //   });

      resetAccount();
      resetPassword();
    } else {
      event.preventDefault();
      event.stopPropagation();
      console.log(account + " is Invalid Username");
    }
  };

  const handleSubmit = evt => {
    console.log(account);
    evt.preventDefault();
    deleteAccount(evt);
  };

  const { value: account, bind: bindAccount, reset: resetAccount } = useInput("");
  //eslint-disable-next-line
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  return (
    <>
      <DeleteAccountButton onClick={handleShow}>
        <MdDelete size={24} />
      </DeleteAccountButton>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}>
        <h2>Delete Account</h2>
        <div>
          <h4>Sure you want to delete your account?</h4>
        </div>
        <DeleteAccountForm onSubmit={handleSubmit} validated={validated}>
          <Form.Group controlId='formBasicUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              size='lg'
              type='text'
              placeholder='Enter Username'
              {...bindAccount}
            />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              size='lg'
              type='password'
              placeholder='Password'
              {...bindPassword}
            />
          </Form.Group>

          <Button variant='danger' type='submit'>
            Delete
          </Button>
        </DeleteAccountForm>
        {/* <DeleteAccountForm onSubmit={handleSubmit}>
          <label>
            Username:
            <input type='text' placeholder='Account name..' {...bindAccount} />
          </label>
          <label>
            Password:
            <input type='password' placeholder='Password..' {...bindPassword} />
          </label>
          <input type='submit' value='Delete' />
        </DeleteAccountForm> */}
        <DeleteAccountFooter>
          <p>All you stored data will be deleted:</p>
          <ul>
            <li>Data stored in server</li>
            <li>Cookies & Localstorage (cached data)</li>
            <li>Preferences/Settings</li>
          </ul>
        </DeleteAccountFooter>
      </Modal>
    </>
  );
};
