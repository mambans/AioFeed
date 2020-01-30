import axios from "axios";
import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import styles from "./Account.module.scss";
import ErrorHandeling from "../error/Error";
import AccountContext from "./../account/AccountContext";
import NavigationContext from "./../navigation/NavigationContext";

export default () => {
  const currentPage = new URL(window.location.href).pathname;
  const { isLoggedIn, setIsLoggedIn } = useContext(NavigationContext);
  const { setAuthKey, setUsername } = useContext(AccountContext);

  document.title = "Notifies | Login";
  const [error, setError] = useState(null);
  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
        },
      },
    };
  };

  const { value: userName, bind: bindUserName, reset: resetUserName } = useInput("");
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();

    loginAccount();
  };

  async function loginAccount() {
    setError(null);
    await axios
      .post(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/login`, {
        username: userName,
        password: password,
      })
      .then(res => {
        document.cookie = `Notifies_AccountName=${res.data.Attributes.Username}; path=/`;
        document.cookie = `Notifies_AccountEmail=${res.data.Attributes.Email}; path=/`;
        document.cookie = `Twitch-access_token=${res.data.Attributes.TwitchToken}; path=/`;
        document.cookie = `Youtube-access_token=${res.data.Attributes.YoutubeToken}; path=/`;
        document.cookie = `Notifies_AccountProfileImg=${res.data.Attributes.ProfileImg}; path=/`;
        document.cookie = `Notifies_AuthKey=${res.data.Attributes.AuthKey}; path=/`;
        setAuthKey(res.data.Attributes.AuthKey);
        setUsername(res.data.Attributes.Username);

        resetUserName();
        resetPassword();
        setIsLoggedIn(true);
      })
      .catch(e => {
        console.error(e);
        setError({
          title: e.response.data,
          message: e.response.status,
        });
      });
  }

  return (
    <>
      {error ? <ErrorHandeling data={error}></ErrorHandeling> : null}
      <h3 className={styles.formTitle}>Login with your Notifies account.</h3>
      <Form onSubmit={handleSubmit} validated className={styles.createForm}>
        <Form.Group controlId='formGroupUserName'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Username' {...bindUserName} />
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' {...bindPassword} />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Login
        </Button>
      </Form>
      {isLoggedIn && !error && (currentPage === "/account/login" || currentPage === "/account") ? (
        <Redirect to='/account'></Redirect>
      ) : null}
    </>
  );
};
