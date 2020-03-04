import axios from "axios";
import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

import { StyledCreateFormTitle, StyledCreateForm, StyledAlert } from "./StyledComponent";
import NavigationContext from "./../NavigationContext";
import AccountContext from "./../../account/AccountContext";
import LoadingIndicator from "./../../LoadingIndicator";

export default () => {
  document.title = "Notifies | Create Account";
  const [error, setError] = useState(null);
  const [created, setCreated] = useState();
  const props = useContext(NavigationContext);
  const [validated, setValidated] = useState(false);
  const { setAuthKey, setUsername } = useContext(AccountContext);

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
        {error ? (
          <StyledAlert variant='warning' dismissible onClose={() => setError(null)}>
            <Alert.Heading>{error.title}</Alert.Heading>
            <hr />
            {error.message.toString()}
          </StyledAlert>
        ) : null}
        <StyledCreateFormTitle>
          <h3>Create</h3>
          <p>Create a Notifies account.</p>
        </StyledCreateFormTitle>
        <StyledCreateForm onSubmit={handleSubmit} noValidate validated={validated}>
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
              required
              isInvalid={!password}
              {...bindPassword}
            />
            <Form.Control.Feedback type='invalid'>Please enter a password.</Form.Control.Feedback>
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant='primary' type='submit'>
              Create
            </Button>
            <Button
              onClick={() => {
                props.setRenderModal("login");
              }}>
              Login
            </Button>
          </div>
        </StyledCreateForm>

        {validated ? <LoadingIndicator height={150} width={150} /> : null}
      </>
    );
  }
};
