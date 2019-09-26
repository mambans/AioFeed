import axios from "axios";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import styles from "./Auth.module.scss";
import ErrorHandeling from "components/error/Error";
import Utilities from "utilities/Utilities";

function NotifiesLogin() {
  document.title = "Notifies | Login";
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

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
    resetUserName();
    resetPassword();
  };

  async function loginAccount() {
    try {
      setError(null);
      const res = await axios.post(`http://localhost:3100/notifies/account/login`, {
        accountName: userName,
        accountPassword: password,
      });

      if (res.data.account[0].username) {
        document.cookie = `Notifies_AccountName=${res.data.account[0].username}; path=/`;
        document.cookie = `Notifies_AccountEmail=${res.data.account[0].email}; path=/`;

        document.cookie = `Twitch-access_token=${Utilities.getCookie(
          "Twitch-access_token"
        )}; path=/`;
        document.cookie = `Youtube-access_token=${Utilities.getCookie(
          "Youtube-access_token"
        )}; path=/`;

        setIsLoggedIn(true);
      } else {
        setError({ title: "Invalid username or password." });
      }
    } catch (error) {
      console.error(error);
      error.title = "Invalid username or password.";
      setError(error);
    }
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
      {isLoggedIn & !error ? (window.location.href = "/account") : null}
    </>
  );
}

export default NotifiesLogin;
