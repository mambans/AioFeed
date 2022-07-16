import React, { useContext, useReducer, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';
import { ThemeSelector } from '../components/themes/styledComponents';
import useInput from '../hooks/useInput';
import AccountContext from '../pages/account/AccountContext';
import LogsContext from '../pages/logs/LogsContext';
import NavigationContext from '../pages/navigation/NavigationContext';
import {
  InlineError,
  StyledCreateForm,
  StyledCreateFormTitle,
} from '../pages/navigation/sidebar/StyledComponents';

const SignIn = ({ text }) => {
  const { authenticate } = useContext(AccountContext);
  const { setSidebarComonentKey } = useContext(NavigationContext);
  const { addLog } = useContext(LogsContext);
  const { value: username, bind: bindUsername } = useInput('');
  const { value: password, bind: bindPassword } = useInput('123456789');
  const [loading, setLoading] = useState();
  const [error, setError] = useReducer((state, error) => {
    switch (error?.message) {
      case 'User is not confirmed.':
        return 'Check your email for confirmation link';
      case 'Missing required parameter USERNAME':
        return 'Please enter your username';
      case 'User is disabled.':
        return 'Your account is disabled';
      default:
        return error?.message;
    }
  }, null);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setError(null);

    await authenticate({ username, password })
      .then((data) => {
        console.log('Logged in data:', data);
        toast.success(`Logged in as ${data?.user?.username}`);
        addLog({
          title: `Logged in`,
          text: `Logged in as  ${data?.user?.username}`,
          icon: 'login',
        });
      })
      .catch((error) => {
        setError(error);
      });
    setLoading(false);
    setSidebarComonentKey({ comp: 'account' });
  };

  return (
    <>
      <StyledCreateFormTitle>Sign In</StyledCreateFormTitle>
      {text && <p style={{ margin: '1rem 0' }}>{text}</p>}
      <StyledCreateForm onSubmit={handleSubmit} noValidate validated={true}>
        <Form.Group controlId='formGroupUserName'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Username'
            name='username'
            required
            {...bindUsername}
          />
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' required {...bindPassword} />
        </Form.Group>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
          <Button variant='primary' type='submit' disabled={!username || !password}>
            Sign In
          </Button>
        </div>
        {error && <InlineError>{error}</InlineError>}
      </StyledCreateForm>
      <ThemeSelector style={{ marginTop: '20px' }} />
      {loading && <LoadingIndicator height={150} width={150} />}
      <Button variant='link' onClick={() => setSidebarComonentKey({ comp: 'SignUp' })}>
        Don't have an account? Create an account here!
      </Button>
      <Link
        style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#ffffff' }}
        to='/legality#Privacy'
      >
        Privacy Notice
      </Link>
    </>
  );
};
export default SignIn;
