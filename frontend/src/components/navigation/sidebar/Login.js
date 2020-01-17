import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import React, { useState, useContext } from "react";

import { StyledCreateFormTitle, StyledCreateForm, StyledAlert } from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import NavigationContext from "./../NavigationContext";
import Utilities from "../../../utilities/Utilities";

export default () => {
  document.title = "Notifies | Login";
  const currentPage = new URL(window.location.href).pathname;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const props = useContext(NavigationContext);
  const { setAuthKey, setUsername, setProfileImage, setTwitchToken, setYoutubeToken } = useContext(
    AccountContext
  );

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
    setLoading(true);
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
        if (res.status === 200 && res.data.Attributes) {
          document.cookie = `Notifies_AccountName=${res.data.Attributes.Username}; path=/`;
          document.cookie = `Notifies_AccountEmail=${res.data.Attributes.Email}; path=/`;
          document.cookie = `Twitch-access_token=${res.data.Attributes.TwitchToken}; path=/`;
          document.cookie = `Youtube-access_token=${res.data.Attributes.YoutubeToken}; path=/`;
          document.cookie = `Notifies_AccountProfileImg=${res.data.Attributes.ProfileImg}; path=/`;
          document.cookie = `Notifies_AuthKey=${res.data.Attributes.AuthKey}; path=/`;
          setAuthKey(res.data.Attributes.AuthKey);
          setUsername(res.data.Attributes.Username);
          setProfileImage(res.data.Attributes.ProfileImg);
          setTwitchToken(res.data.Attributes.TwitchToken);
          setYoutubeToken(res.data.Attributes.YoutubeToken);

          resetUserName();
          resetPassword();
          props.setIsLoggedIn(true);
        } else {
          console.log(res);
          //   setError({
          //   title: res.response.data,
          //   message: e.response.status,
          // });
        }
      })
      .catch(e => {
        console.error(e);
        console.log(e);
        setError({
          title: e.response.data,
          message: e.response.status,
        });
      });
  }

  return (
    <>
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
      {loading ? (
        <Spinner animation='grow' role='status' style={Utilities.loadingSpinner}>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      ) : null}
      {props.isLoggedIn &&
      !error &&
      (currentPage === "/account/login" || currentPage === "/account") ? (
        <Redirect to='/account'></Redirect>
      ) : null}
    </>
  );
};
