import axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

import styles from "./Account.module.scss";
import ErrorHandeling from "../error/Error";

function NotifiesCreateAccount() {
  document.title = "Notifies | Create Account";
  const [error, setError] = useState(null);

  const [created, setCreated] = useState();

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
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    createAccount();
  };

  async function createAccount() {
    setError(null);
    await axios
      .post(`http://localhost:3100/notifies/account/create`, {
        accountName: userName,
        accountEmail: email,
        accountPassword: password,
      })
      .then(data => {
        if (data.status === 200 && data.data === "Account successfully created") {
          document.cookie = `Notifies_AccountName=${userName}; path=/`;
          document.cookie = `Notifies_AccountEmail=${email}; path=/`;
          document.cookie = `Twitch-access_token=null; path=/`;
          document.cookie = `Youtube-access_token=null; path=/`;
          document.cookie = `Notifies_AccountProfileImg=null  ; path=/`;

          resetUserName();
          resetEmail();
          resetPassword();
          setCreated(true);
        }
      })
      .catch(error => {
        console.error(error);
        setError({
          title: error.response.data,
          message: error.response.status,
        });
      });
  }

  if (created) {
    return <Redirect to='/account' />;
  } else {
    return (
      <>
        {error ? <ErrorHandeling data={error}></ErrorHandeling> : null}
        <h3 className={styles.formTitle}>Create a Notifies account.</h3>
        <Form onSubmit={handleSubmit} validated className={styles.createForm}>
          <Form.Group controlId='formGroupUserName'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' placeholder='Username' nane='username' {...bindUserName} />
          </Form.Group>
          <Form.Group controlId='formGroupEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type='email' placeholder='Enter email' {...bindEmail} />
          </Form.Group>
          <Form.Group controlId='formGroupPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' {...bindPassword} />
          </Form.Group>
          <Button variant='primary' type='submit'>
            Create
          </Button>
        </Form>
      </>
    );
  }
}

export default NotifiesCreateAccount;
