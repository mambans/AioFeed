import { Form, Button } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';

import { StyledCreateFormTitle, StyledCreateForm } from './StyledComponents';
import AccountContext from './../../account/AccountContext';
import LoadingIndicator from './../../LoadingIndicator';
import NavigationContext from './../NavigationContext';
import Themeselector from '../../themes/Themeselector';
import useInput from './../../../hooks/useInput';
import FeedsContext from '../../feed/FeedsContext';
import VodsContext from '../../twitch/vods/VodsContext';
import API from '../API';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';

const Login = () => {
  useDocumentTitle('Login');
  const [validated, setValidated] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const { setRenderModal } = useContext(NavigationContext);
  const { setTwitterLists } = useContext(FeedsContext);
  const { setChannels, setFavStreams } = useContext(VodsContext);
  const {
    setTwitchAccessToken,
    setTwitchRefreshToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImage,
  } = useContext(TwitchContext);
  const { setUsername, setProfileImage, setAuthKey, setEmail } = useContext(AccountContext);
  const { setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage } =
    useContext(YoutubeContext);

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

  async function loginAccount() {
    await API.login(username, password)
      .then((result) => {
        const res = result.data.Attributes;
        if (result.status === 200 && res) {
          if (res.TwitchPreferences && Object.keys(res.TwitchPreferences).length >= 1) {
            localStorage.setItem(
              'ChannelsUpdateNotifs',
              JSON.stringify(res.TwitchPreferences.ChannelsUpdateNotifs)
            );
            setFavStreams(res.TwitchPreferences.favoriteStreams);
          }

          if (res.TwitchVodsPreferences && Object.keys(res.TwitchVodsPreferences).length >= 1) {
            setChannels(res.TwitchVodsPreferences.Channels);
          }

          if (res.TwitterPreferences && Object.keys(res.TwitterPreferences).length >= 1) {
            localStorage.setItem('Twitter-Lists', JSON.stringify(res.TwitterPreferences.Lists));
          }

          setTimeout(() => {
            setUsername(res.Username);
            setProfileImage(res.ProfileImg);
            setAuthKey(res.AuthKey);
            setEmail(res.Email);

            if (res.TwitchPreferences && Object.keys(res.TwitchPreferences).length >= 1) {
              setTwitchUsername(res.TwitchPreferences.Username);
              setTwitchUserId(res.TwitchPreferences.Id);
              setTwitchProfileImage(res.TwitchPreferences.Profile);
              setTwitchAccessToken(res.TwitchPreferences.Token);
              setTwitchRefreshToken(res.TwitchPreferences.Refresh_token);
            }

            if (res.YoutubePreferences && Object.keys(res.YoutubePreferences).length >= 1) {
              setYoutubeUsername(res.YoutubePreferences.Username);
              setYoutubeProfileImage(res.YoutubePreferences.Profile);
              setYoutubeAccessToken(res.YoutubePreferences.Token);
            }

            if (res.TwitterPreferences && Object.keys(res.TwitterPreferences).length >= 1) {
              setTwitterLists(res.TwitterPreferences.Lists);
            }

            setRenderModal('account');
            toast.success(`Logged in as ${res.Username}`);
          }, 500);
        } else {
          console.log(result);
        }
      })
      .catch((e) => {
        setValidated(false);
        toast.warning(`${e.response.data.message}`);
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
