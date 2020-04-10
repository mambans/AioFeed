import { Form, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import React, { useState, useContext } from "react";
import axios from "axios";

import { DeleteAccountForm, DeleteAccountButton } from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import styles from "./Sidebar.module.scss";
import useInput from "./../../useInput";
import NavigationContext from "../NavigationContext";
import Alert from "./Alert";
import LoadingIndicator from "./../../LoadingIndicator";

export default () => {
  const {
    username,
    setUsername,
    setProfileImage,
    setAuthKey,
    setTwitchToken,
    setYoutubeToken,
    authKey,
  } = useContext(AccountContext);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const { setRenderModal, setAlert } = useContext(NavigationContext);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const deleteAccount = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === true && account === username) {
      // console.log("Deleted account " + account);
      setValidated(true);

      await axios
        .delete(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/delete`, {
          data: { username: account, password: password, authKey: authKey },
        })
        .then((res) => {
          document.cookie = `Twitch-access_token=null; path=/; SameSite=Lax`;
          document.cookie = `Twitch-refresh_token=null; path=/; SameSite=Lax`;
          document.cookie = `Twitch_FeedEnabled=${false}; path=/`;
          document.cookie = `AioFeed_TwitchUserId=null; path=/; SameSite=Lax`;
          document.cookie = `Twitch-username=null; path=/; SameSite=Lax`;
          document.cookie = `YoutubeFeedEnabled=null; path=/`;
          document.cookie = `AioFeed_AccountName=null; path=/`;
          document.cookie = `AioFeed_AccountEmail=null; path=/`;
          document.cookie = `Youtube-access_token=null; path=/`;
          document.cookie = `AioFeed_AccountProfileImg=null; path=/`;
          document.cookie = `Twitch-refresh_token=null; path=/; SameSite=Lax`;
          document.cookie = `Youtube_FeedEnabled=${false}; path=/`;
          document.cookie = `TwitchVods_FeedEnabled=${false}; path=/`;

          setTwitchToken(null);
          setYoutubeToken(null);
          setUsername();
          setProfileImage();
          setAuthKey();

          setRenderModal("create");
          setAlert({
            bold: res.data.Attributes.Username,
            message: ` account deleted`,
            variant: "success",
          });
        })
        .catch((err) => {
          console.error(err);
          setAlert({
            message: err.response.data.message,
            variant: "warning",
          });
          setValidated(false);
          resetPassword();
        });
    } else {
      event.preventDefault();
      event.stopPropagation();
      console.log(account + " is Invalid Username");
    }
  };

  const handleSubmit = (evt) => {
    console.log(account);
    evt.preventDefault();
    deleteAccount(evt);
  };

  // eslint-disable-next-line no-unused-vars
  const { value: account, bind: bindAccount, reset: resetAccount } = useInput("");
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
