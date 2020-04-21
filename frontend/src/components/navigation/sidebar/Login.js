import { Form, Button } from "react-bootstrap";
import axios from "axios";
import React, { useState, useContext } from "react";

import { StyledCreateFormTitle, StyledCreateForm } from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import NavigationContext from "./../NavigationContext";
import LoadingIndicator from "./../../LoadingIndicator";
import FeedsContext from "./../../feed/FeedsContext";
import useInput from "./../../../hooks/useInput";

export default () => {
  document.title = "AioFeed | Login";
  const [validated, setValidated] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);
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
  } = useContext(AccountContext);
  const { setEnableTwitch, setTwitterListName } = useContext(FeedsContext);

  const { value: username, bind: bindUsername, reset: resetUsername } = useInput("");
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      setValidated(true);
      setValidatedUsername(true);
      setValidatedPassword(true);
      loginAccount();
    }
  };

  function parseBolean(value) {
    if (value === "null" || !value) {
      return null;
    } else {
      return value;
    }
  }

  async function loginAccount() {
    await axios
      .post(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200 && res.data.Attributes) {
          resetUsername();
          resetPassword();
          // console.log("TCL: loginAccount -> res.data.Attributes", res.data.Attributes);
          document.cookie = `AioFeed_AccountName=${res.data.Attributes.Username}; path=/`;
          document.cookie = `AioFeed_AccountProfileImg=${res.data.Attributes.ProfileImg}; path=/`;
          document.cookie = `AioFeed_AuthKey=${res.data.Attributes.AuthKey}; path=/`;
          document.cookie = `AioFeed_AccountEmail=${res.data.Attributes.Email}; path=/`;

          document.cookie = `Twitch-access_token=${res.data.Attributes.TwitchToken}; path=/; SameSite=Lax`;
          document.cookie = `Twitter-Listname=${res.data.Attributes.TwitterListId}; path=/; SameSite=Lax`;

          document.cookie = `Youtube-access_token=${res.data.Attributes.YoutubeToken}; path=/; SameSite=Lax`;

          if (res.data.Attributes.TwitchPreference) {
            document.cookie = `Twitch_AutoRefresh=${parseBolean(
              res.data.Attributes.TwitchPreferences.AutoRefresh
            )}; path=/`;
            document.cookie = `Twitch_FeedEnabled=${parseBolean(
              res.data.Attributes.TwitchPreferences.enabled
            )}; path=/`;
            document.cookie = `Twitch-userId=${parseBolean(
              res.data.Attributes.TwitchPreferences.id
            )}; path=/`;

            setEnableTwitch(res.data.Attributes.TwitchPreferences.enabled === "true" || false);
            setTwitchUsername(parseBolean(res.data.Attributes.TwitchPreferences.Username));
            setTwitchUserId(parseBolean(res.data.Attributes.TwitchPreferences.Id));
            setTwitchProfileImg(parseBolean(res.data.Attributes.TwitchPreferences.Profile));
            setAutoRefreshEnabled(parseBolean(res.data.Attributes.TwitchPreferences.AutoRefresh));
          }

          setTwitterListName(res.data.Attributes.TwitterListId);
          setAuthKey(parseBolean(res.data.Attributes.AuthKey));
          setProfileImage(parseBolean(res.data.Attributes.ProfileImg));
          setTwitchToken(parseBolean(res.data.Attributes.TwitchToken));
          setYoutubeToken(parseBolean(res.data.Attributes.YoutubeToken));

          setUsername(parseBolean(res.data.Attributes.Username));
        } else {
          console.log(res);
        }
      })
      .catch((e) => {
        setValidated(false);
        if (e.response.data.message === "Invalid Password") {
          resetPassword();
          setValidatedPassword(false);
        } else if (e.response.data.message === "Invalid Username") {
          setValidatedUsername(false);
        }
      });
  }

  return (
    <>
      <StyledCreateFormTitle>
        <h3>Login</h3>
        <p>Login with your AioFeed account</p>
      </StyledCreateFormTitle>
      <StyledCreateForm onSubmit={handleSubmit} noValidate validated={validated}>
        <Form.Group controlId='formGroupUserName'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Username'
            required
            {...bindUsername}
            isInvalid={!validatedUsername}
          />
          <Form.Control.Feedback type='invalid'>Invalid Username</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            required
            {...bindPassword}
            isInvalid={!validatedPassword}
          />
          <Form.Control.Feedback type='invalid'>Invalid Password</Form.Control.Feedback>
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant='primary' type='submit' disabled={(!username && !password) || validated}>
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
      {validated && <LoadingIndicator height={150} width={150} />}
    </>
  );
};
