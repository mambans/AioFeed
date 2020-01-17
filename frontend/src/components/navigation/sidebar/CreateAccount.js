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
  const [loading, setLoading] = useState(false);
  const props = useContext(NavigationContext);
  const { setAuthKey, setUsername } = useContext(AccountContext);

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
    setLoading(true);
    createAccount();
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
          setUsername(res.data.Username);
          setAuthKey(res.data.AuthKey);

          resetUserName();
          resetEmail();
          resetPassword();
          props.setIsLoggedIn(true);

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

        <StyledCreateFormTitle>Create a Notifies account.</StyledCreateFormTitle>
        <StyledCreateForm onSubmit={handleSubmit} validated>
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

        {loading ? <LoadingIndicator height={150} width={150} /> : null}
      </>
    );
  }
};
