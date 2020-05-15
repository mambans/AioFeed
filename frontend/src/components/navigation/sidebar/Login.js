import { Form, Button } from "react-bootstrap";
import axios from "axios";
import React, { useState, useContext } from "react";

import { StyledCreateFormTitle, StyledCreateForm } from "./StyledComponent";
import AccountContext from "./../../account/AccountContext";
import NavigationContext from "./../NavigationContext";
import LoadingIndicator from "./../../LoadingIndicator";
import useInput from "./../../../hooks/useInput";
import { AddCookie } from "../../../util/Utils";

export default () => {
  document.title = "AioFeed | Login";
  const [validated, setValidated] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const { setRenderModal } = useContext(NavigationContext);
  const { setUsername } = useContext(AccountContext);

  // eslint-disable-next-line no-unused-vars
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
      .then((result) => {
        const res = result.data.Attributes;
        if (result.status === 200 && res) {
          AddCookie("AioFeed_AccountName", res.Username);
          AddCookie("AioFeed_AccountProfileImg", res.ProfileImg);
          AddCookie("AioFeed_AuthKey", res.AuthKey);
          AddCookie("AioFeed_AccountEmail", res.Email);
          AddCookie("Twitter-Listname", res.TwitterListId);
          localStorage.setItem("VodChannels", JSON.stringify(res.MonitoredChannels));
          localStorage.setItem(
            "UpdateNotificationsChannels",
            JSON.stringify(res.UpdateNotisChannels)
          );

          if (res.TwitchPreferences && Object.keys(res.TwitchPreferences).length !== 0) {
            AddCookie("Twitch-access_token", res.TwitchPreferences.Token);
            AddCookie("Twitch-refresh_token", res.TwitchPreferences.Refresh_token);

            AddCookie("Twitch-userId", res.TwitchPreferences.Id);
            AddCookie("Twitch-username", res.TwitchPreferences.Username);
            AddCookie("Twitch-profileImg", res.TwitchPreferences.Profile);
            AddCookie("Twitch_AutoRefresh", parseBolean(res.TwitchPreferences.AutoRefresh));

            // AddCookie("Youtube-Twitch_FeedEnabled", parseBolean(res.TwitchPreferences.enabled));
          }

          if (res.YoutubePreferences && Object.keys(res.YoutubePreferences).length !== 0) {
            AddCookie("YoutubeUsername", res.YoutubePreferences.Username);
            AddCookie("YoutubeProfileImg", res.YoutubePreferences.Profile);
            AddCookie("Youtube-access_token", res.YoutubePreferences.Token);
          }

          setTimeout(() => {
            setUsername(res.Username);
          }, 0);
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
