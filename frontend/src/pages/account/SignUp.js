import React, { useContext, useReducer, useState } from 'react';
import { Breadcrumb, Button, Form } from 'react-bootstrap';
import LoadingIndicator from '../../components/LoadingIndicator';
import useInput from '../../hooks/useInput';
import NavigationContext from '../navigation/NavigationContext';
import {
  InlineError,
  StyledCreateForm,
  StyledCreateFormTitle,
} from '../navigation/sidebar/StyledComponents';
import { Auth } from 'aws-amplify';

const SignUp = () => {
  const { setSidebarComonentKey } = useContext(NavigationContext);
  const { value: username, bind: bindUsername } = useInput('');
  const { value: email, bind: bindEmail } = useInput('');
  const { value: password, bind: bindPassword } = useInput('');
  const [loading, setLoading] = useState();

  const [error, setError] = useReducer((state, error) => {
    switch (error?.message || error) {
      case 'User is not confirmed.':
        return 'Check your email for confirmation link';
      case 'Missing required parameter USERNAME':
      case 'Username cannot be empty':
        return 'Please enter a username';
      case 'User is disabled.':
        return 'Your account is disabled';
      default:
        return error?.message;
    }
  }, null);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setError(null);
    setLoading(true);

    Auth.signUp({
      username,
      password,
      attributes: {
        email,
      },
    })
      .then((data) => {
        setError(error);
        setLoading(false);

        if (data) {
          setSidebarComonentKey({
            comp: 'account',
            text: (
              <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                Confirmation link sent to <b>{email}</b>,<span>please check you'r email.</span>
              </span>
            ),
          });
        }
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item active={true} onClick={() => setSidebarComonentKey({ comp: 'signout' })}>
          Sign out
        </Breadcrumb.Item>
      </Breadcrumb>
      <StyledCreateFormTitle>Sign Up</StyledCreateFormTitle>
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
        <Form.Group controlId='formGroupEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' required {...bindEmail} />
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' required {...bindPassword} />
        </Form.Group>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
          {/* <Button variant='primary' type='submit' disabled={!username || !password || !email}> */}
          <Button variant='primary' type='submit'>
            Create
          </Button>
        </div>
        {error && <InlineError>{error}</InlineError>}
      </StyledCreateForm>
      {loading && <LoadingIndicator height={150} width={150} />}
    </>
  );
};
export default SignUp;
