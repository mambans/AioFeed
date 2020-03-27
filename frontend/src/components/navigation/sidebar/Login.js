import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import React, { useState, useContext } from "react";

import { StyledCreateFormTitle, StyledCreateForm, StyledAlert } from "./StyledComponent";
import { AccountContext } from "./../../account/AccountContext";
import { NavigationContext } from "./../NavigationContext";
import LoadingIndicator from "./../../LoadingIndicator";
import { FeedsContext } from "./../../feed/FeedsContext";
import useInput from "./../../useInput";

export default () => {
  document.title = "Notifies | Login";
  const currentPage = new URL(window.location.href).pathname;
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const { setRenderModal } = useContext(NavigationContext);
  const {
    setAuthKey,
    setUsername,
    setProfileImage,
    setTwitchToken,
    setYoutubeToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImg,
    setAutoRefreshEnabled,
    username,
  } = useContext(AccountContext);
  const { setEnableTwitch } = useContext(FeedsContext);

  const { value: userName, bind: bindUserName, reset: resetUserName } = useInput("");
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();

    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      loginAccount();
      setValidated(true);
    }
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
          console.log("TCL: loginAccount -> res.data.Attributes", res.data.Attributes);
          document.cookie = `Notifies_AccountName=${res.data.Attributes.Username}; path=/`;
          document.cookie = `Notifies_AccountEmail=${res.data.Attributes.Email}; path=/`;
          document.cookie = `Twitch-access_token=${res.data.Attributes.TwitchToken}; path=/; SameSite=Lax`;
          document.cookie = `Youtube-access_token=${res.data.Attributes.YoutubeToken}; path=/`;
          document.cookie = `Notifies_AccountProfileImg=${res.data.Attributes.ProfileImg}; path=/`;
          document.cookie = `Notifies_AuthKey=${res.data.Attributes.AuthKey}; path=/`;
          document.cookie = `Twitch_AutoRefresh=${res.data.Attributes.TwitchPreferences.AutoRefresh}; path=/`;
          document.cookie = `Twitch_feedEnabled=${res.data.Attributes.TwitchPreferences.enabled}; path=/`;

          setAuthKey(res.data.Attributes.AuthKey);
          setProfileImage(res.data.Attributes.ProfileImg);
          setTwitchToken(res.data.Attributes.TwitchToken);
          if (res.data.Attributes.TwitchToken && res.data.Attributes.TwitchPreferences.enabled) {
            setEnableTwitch(true);
          }
          setYoutubeToken(res.data.Attributes.YoutubeToken);

          setTwitchUsername(res.data.Attributes.TwitchPreferences.Username);
          setTwitchUserId(res.data.Attributes.TwitchPreferences.Id);
          setTwitchProfileImg(res.data.Attributes.TwitchPreferences.Profile);
          setAutoRefreshEnabled(res.data.Attributes.TwitchPreferences.AutoRefresh);
          setUsername(res.data.Attributes.Username);

          resetUserName();
          resetPassword();
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
      <StyledCreateFormTitle>
        <h3>Login</h3>
        <p>Login with your Notifies account</p>
      </StyledCreateFormTitle>
      <StyledCreateForm onSubmit={handleSubmit} noValidate validated={validated}>
        <Form.Group controlId='formGroupUserName'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Username'
            required
            {...bindUserName}
            isInvalid={!userName}
          />
          <Form.Control.Feedback type='invalid'>Please enter a username.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            required
            {...bindPassword}
            isInvalid={!password}
          />
          <Form.Control.Feedback type='invalid'>Please enter a password.</Form.Control.Feedback>
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant='primary' type='submit'>
            Login
          </Button>
          <Button
            onClick={() => {
              setRenderModal("create");
            }}>
            Create Account
          </Button>
        </div>
      </StyledCreateForm>
      {validated ? <LoadingIndicator height={150} width={150} /> : null}
      {username && !error && (currentPage === "/account/login" || currentPage === "/account") ? (
        <Redirect to='/account'></Redirect>
      ) : null}
    </>
  );
};
