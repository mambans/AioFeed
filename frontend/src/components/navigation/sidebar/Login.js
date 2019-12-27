import axios from "axios";
import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

import { StyledCreateFormTitle, StyledCreateForm, StyledAlert } from "./styledComponent";
import NavigationContext from "./../NavigationContext";

function LoginModal() {
  const currentPage = new URL(window.location.href).pathname;
  const props = useContext(NavigationContext);

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
    // try {
    //   await axios
    //     .post(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/login`, {
    //       username: userName,
    //       password: password,
    //     })
    //     .then(res => {
    //       console.log("====================================");
    //       console.log(res);
    //       console.log("====================================");
    //     })
    //     .catch(e => {
    //       console.error(e);
    //     });
    // } catch (e) {
    //   console.log("TCL: loginAccount -> e", e);
    // }

    await axios
      .post(`http://localhost:3100/notifies/account/login`, {
        accountName: userName,
        accountPassword: password,
      })
      .then(res => {
        document.cookie = `Notifies_AccountName=${res.data.account.username}; path=/`;
        document.cookie = `Notifies_AccountEmail=${res.data.account.email}; path=/`;
        document.cookie = `Twitch-access_token=${res.data.account.twitch_token}; path=/`;
        document.cookie = `Youtube-access_token=${res.data.account.youtube_token}; path=/`;
        document.cookie = `Notifies_AccountProfileImg=${res.data.account.profile_img}; path=/`;

        resetUserName();
        resetPassword();
        props.setIsLoggedIn(true);
      })
      .catch(error => {
        console.error(error);
        setError({
          title: error.response.data,
          message: error.response.status,
        });
      });
  }

  return (
    <>
      {/* {error ? <ErrorHandeling data={error}></ErrorHandeling> : null} */}
      {error ? (
        <StyledAlert variant='warning' dismissible onClose={() => setError(null)}>
          <Alert.Heading>{error.title}</Alert.Heading>
          <hr />
          {error.message.toString()}
        </StyledAlert>
      ) : null}
      <StyledCreateFormTitle>Login with your Notifies account.</StyledCreateFormTitle>
      <StyledCreateForm onSubmit={handleSubmit} validated>
        <Form.Group controlId='formGroupUserName'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='Username' {...bindUserName} />
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' {...bindPassword} />
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant='primary' type='submit'>
            Login
          </Button>
          <Button
            onClick={() => {
              props.setRenderModal("create");
            }}>
            Create Account
          </Button>
        </div>
      </StyledCreateForm>
      {props.isLoggedIn &&
      !error &&
      (currentPage === "/account/login" || currentPage === "/account") ? (
        <Redirect to='/account'></Redirect>
      ) : null}
    </>
  );
}

export default LoginModal;
