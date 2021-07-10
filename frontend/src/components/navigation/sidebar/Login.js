import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import React, { useState, useContext } from 'react';

import { AddCookie } from '../../../util/Utils';
import { StyledCreateFormTitle, StyledCreateForm } from './StyledComponents';
import AccountContext from './../../account/AccountContext';
import LoadingIndicator from './../../LoadingIndicator';
import NavigationContext from './../NavigationContext';
import Themeselector from '../../themes/Themeselector';
import useInput from './../../../hooks/useInput';

const Login = () => {
  document.title = 'AioFeed | Login';
  const [validated, setValidated] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const { setRenderModal } = useContext(NavigationContext);
  const { setUsername } = useContext(AccountContext);

  // eslint-disable-next-line no-unused-vars
  const { value: username, bind: bindUsername, reset: resetUsername } = useInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useInput('');

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
    if (value === 'null' || !value) return null;
    return value;
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
          AddCookie('AioFeed_AccountName', res.Username);
          AddCookie('AioFeed_AccountProfileImg', res.ProfileImg);
          AddCookie('AioFeed_AuthKey', res.AuthKey);
          AddCookie('AioFeed_AccountEmail', res.Email);

          if (res.TwitchPreferences && Object.keys(res.TwitchPreferences).length >= 1) {
            AddCookie('Twitch-access_token', res.TwitchPreferences.Token);
            AddCookie('Twitch-refresh_token', res.TwitchPreferences.Refresh_token);

            AddCookie('Twitch-userId', res.TwitchPreferences.Id);
            AddCookie('Twitch-username', res.TwitchPreferences.Username);
            AddCookie('Twitch-profileImg', res.TwitchPreferences.Profile);
            AddCookie('Twitch_AutoRefresh', parseBolean(res.TwitchPreferences.AutoRefresh));
            AddCookie('Twitch_FeedEnabled', parseBolean(res.TwitchPreferences.Enabled));
            localStorage.setItem(
              'Twitch-ChannelsUpdateNotifs',
              JSON.stringify(res.TwitchPreferences.ChannelsUpdateNotifs)
            );
          }

          if (res.TwitchVodsPreferences && Object.keys(res.TwitchVodsPreferences).length >= 1) {
            AddCookie('TwitchVods_FeedEnabled', res.TwitchVodsPreferences.Enabled);
            localStorage.setItem(
              'TwitchVods-Channels',
              JSON.stringify(res.TwitchVodsPreferences.Channels)
            );
          }

          if (res.TwitterPreferences && Object.keys(res.TwitterPreferences).length >= 1) {
            AddCookie('Twitter_FeedEnabled', res.TwitterPreferences.Enabled);
            localStorage.setItem('Twitter-Lists', JSON.stringify(res.TwitterPreferences.Lists));
          }

          if (res.YoutubePreferences && Object.keys(res.YoutubePreferences).length >= 1) {
            AddCookie('YoutubeUsername', res.YoutubePreferences.Username);
            AddCookie('YoutubeProfileImg', res.YoutubePreferences.Profile);
            AddCookie('Youtube-access_token', res.YoutubePreferences.Token);
          }

          setTimeout(() => {
            setUsername(res.Username);
          }, 500);
        } else {
          console.log(result);
        }
      })
      .catch((e) => {
        setValidated(false);
        if (e?.response?.data?.message === 'Invalid Password') {
          resetPassword();
          setValidatedPassword(false);
        } else if (e?.response?.data?.message === 'Invalid Username') {
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='primary' type='submit' disabled={(!username && !password) || validated}>
            Login
          </Button>
          <Button onClick={() => setRenderModal('create')}>Create Account</Button>
        </div>
      </StyledCreateForm>
      <Themeselector style={{ marginTop: '20px' }} />
      {validated && <LoadingIndicator height={150} width={150} />}
    </>
  );
};

export default Login;
