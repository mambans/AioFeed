import axios from "axios";
import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

import styles from "./Account.module.scss";
import ErrorHandeling from "../error/Error";
import AccountContext from "./AccountContext";

export default () => {
  document.title = "N | Create Account";
  const { setAuthKey, setUsername } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  const [created, setCreated] = useState();

  const validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value.trim());
        },
      },
    };
  };

  const { value: userName, bind: bindUserName, reset: resetUserName } = useInput("");
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      setValidated(true);
      createAccount();
    }
  };

  async function createAccount() {
    setError(null);
    try {
      await axios
        .post(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/create`, {
          username: userName,
          email: email,
          password: password,
        })
        .then(res => {
          document.cookie = `Notifies_AccountName=${res.data.Username}; path=/`;
          document.cookie = `Notifies_AccountEmail=${res.data.Email}; path=/`;
          document.cookie = `Notifies_AuthKey=${res.data.AuthKey}; path=/`;
          setAuthKey(res.data.AuthKey);
          setUsername(res.data.Username);

          resetUserName();
          resetEmail();
          resetPassword();

          if (new URL(window.location.href).pathname === "/account/create") {
            setCreated(true);
          }
        })
        .catch(e => {
          console.error(e);
          setError({
            title: error.response.data,
            message: error.response.status,
          });
        });
    } catch (e) {
      console.error(e);
    }
  }

  if (created) {
    return <Redirect to='/account' />;
  } else {
    return (
      <>
        {error ? <ErrorHandeling data={error}></ErrorHandeling> : null}
        <h3 className={styles.formTitle}>Create a Notifies account.</h3>
        <Form
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          className={styles.createForm}>
          <Form.Group controlId='formGroupUserName'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Username'
              name='username'
              required
              isInvalid={!userName}
              {...bindUserName}
            />
            <Form.Control.Feedback type='invalid'>Please enter a username.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='formGroupEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              required
              isInvalid={!email || !validateEmail(email)}
              {...bindEmail}
            />
            <Form.Control.Feedback type='invalid'>Please enter an email.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='formGroupPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              isInvalid={!password}
              {...bindPassword}
            />
          </Form.Group>
          <Button variant='primary' type='submit'>
            Create
          </Button>
        </Form>
      </>
    );
  }
};
