import axios from "axios";
import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

import { StyledCreateFormTitle, StyledCreateForm, StyledAlert } from "./StyledComponent";
import NavigationContext from "./../NavigationContext";
import AccountContext from "./../../account/AccountContext";
import LoadingIndicator from "./../../LoadingIndicator";
import useInput from "./../../../hooks/useInput";
import ALert from "./Alert";

export default () => {
  document.title = "AioFeed | Create Account";
  const [error, setError] = useState(null);
  const { setAlert, setRenderModal } = useContext(NavigationContext);
  const [validated, setValidated] = useState(false);
  const { setAuthKey, setUsername } = useContext(AccountContext);

  const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const { value: userName, bind: bindUserName, reset: resetUserName } = useInput("");
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  const handleSubmit = (evt) => {
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
        .post(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/create`, {
          username: userName,
          email: email,
          password: password,
        })
        .then((res) => {
          document.cookie = `AioFeed_AccountName=${res.data.Username}; path=/`;
          document.cookie = `AioFeed_AccountEmail=${res.data.Email}; path=/`;
          document.cookie = `AioFeed_AuthKey=${res.data.AuthKey}; path=/`;
          setAuthKey(res.data.AuthKey);
          setUsername(res.data.Username);

          resetUserName();
          resetEmail();
          resetPassword();
        })
        .catch((error) => {
          console.error(error.response);
          if (error.response.data.code === "ConditionalCheckFailedException") {
            setAlert({
              message: `Username is already taken`,
              variant: "warning",
            });
          }
          // setError({
          //   title: error.response.data,
          //   message: error.response.status,
          // });
        });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <ALert />

      {error && (
        <StyledAlert variant='warning' dismissible onClose={() => setError(null)}>
          <Alert.Heading>{error.title}</Alert.Heading>
          <hr />
          {error.message.toString()}
        </StyledAlert>
      )}
      <StyledCreateFormTitle>
        <h3>Create</h3>
        <p>Create a AioFeed account.</p>
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
              setRenderModal("login");
            }}>
            Login
          </Button>
        </div>
      </StyledCreateForm>

      {validated && <LoadingIndicator height={150} width={150} />}
    </>
  );
};
