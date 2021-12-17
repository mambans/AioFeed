import { Form, Button } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { StyledCreateFormTitle, StyledCreateForm } from './StyledComponents';
import AccountContext from './../../account/AccountContext';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NavigationContext from './../NavigationContext';
import Themeselector from '../../../components/themes/Themeselector';
import useInput from './../../../hooks/useInput';
import API from '../API';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import MyListsContext from '../../myLists/MyListsContext';
import LogsContext from '../../logs/LogsContext';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';
import TwitterContext from '../../twitter/TwitterContext';
import FeedSectionsContext from '../../feedSections/FeedSectionsContext';
import VodsContext from '../../twitch/vods/VodsContext';

const Login = () => {
  useDocumentTitle('Login');
  const [validated, setValidated] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState(true);
  const [validatedPassword, setValidatedPassword] = useState(true);
  const { setRenderModal } = useContext(NavigationContext);
  const { setUsername, setProfileImage, setAuthKey, setEmail } = useContext(AccountContext);
  const { addLog } = useContext(LogsContext);
  const { fetchTwitchContextData } = useContext(TwitchContext);
  const { fetchFeedSectionsContextData } = useContext(FeedSectionsContext);
  const { fetchVodsContextData } = useContext(VodsContext);
  const { fetchYoutubeContextData } = useContext(YoutubeContext);
  const { fetchTwitterContextData } = useContext(TwitterContext);
  const { fetchMyListContextData } = useContext(MyListsContext);

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
          setAuthKey(res.AuthKey);
          setUsername(res.Username);
          setProfileImage(res.ProfileImg);
          setEmail(res.Email);

          setTimeout(() => {
            fetchTwitchContextData();
            fetchFeedSectionsContextData();
            fetchVodsContextData();
            fetchYoutubeContextData();
            fetchTwitterContextData();
            fetchMyListContextData();
          }, 1);

          setTimeout(() => {
            toast.success(`Logged in as ${res.Username}`);
            setRenderModal('account');
            addLog({
              title: `Logged in`,
              text: `Logged in as  ${res.Username}`,
              icon: 'login',
            });
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

      <Link
        style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#ffffff' }}
        to='/legality#Privacy'
      >
        Privacy Notice
      </Link>
    </>
  );
};

export default Login;
