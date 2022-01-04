import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { StyledCreateFormTitle, StyledCreateForm } from './StyledComponents';
import NavigationContext from './../NavigationContext';
import AccountContext from './../../account/AccountContext';
import LoadingIndicator from '../../../components/LoadingIndicator';
import useInput from './../../../hooks/useInput';
import SidebarAlert from './Alert';
import AlertHandler from '../../../components/alert';
import API from '../API';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const CreateAccount = () => {
  useDocumentTitle('Create Account');
  const [error, setError] = useState(null);
  const { setAlert, setRenderModal } = useContext(NavigationContext);
  const [validated, setValidated] = useState(false);
  const { setAuthKey, setUsername, setEmail } = useContext(AccountContext);

  const validateEmail = (email) => {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const { value: userName, bind: bindUserName } = useInput('');
  const { value: email, bind: bindEmail } = useInput('');
  const { value: password, bind: bindPassword } = useInput('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const form = evt.currentTarget;

    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      setValidated(true);
      createAccount();
    }
  };

  async function createAccount() {
    setError(null);

    try {
      await API.createAccount(userName, password, email)
        .then((res) => {
          setAuthKey(res.data.AuthKey);
          setUsername(res.data.Username);
          setEmail(res.data.Email);

          setRenderModal('account');
        })
        .catch((error) => {
          console.error(error.response);
          if (error.response.data.code === 'ConditionalCheckFailedException') {
            setAlert({
              message: `Username is already taken`,
              variant: 'warning',
            });
          }
        });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <SidebarAlert />
      <AlertHandler
        show={error}
        type='warning'
        title={error?.title}
        message={error?.message}
        onClose={() => setError(null)}
      />

      <StyledCreateFormTitle>
        <h3>Create</h3>
        <p>Create a AioFeed account.</p>
      </StyledCreateFormTitle>
      <StyledCreateForm onSubmit={handleSubmit} noValidate validated={validated}>
        <Form.Group controlId='formGroupUserName'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Username'
            name='username'
            required
            isInvalid={!userName}
            {...bindUserName}
          />
          <Form.Control.Feedback type='invalid'>Please enter a username.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='formGroupEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            required
            isInvalid={!email || !validateEmail(email)}
            {...bindEmail}
          />
          <Form.Control.Feedback type='invalid'>Please enter an email.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='formGroupPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            required
            isInvalid={!password}
            {...bindPassword}
          />
          <Form.Control.Feedback type='invalid'>Please enter a password.</Form.Control.Feedback>
        </Form.Group>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='primary' type='submit'>
            Create
          </Button>
          <Button onClick={() => setRenderModal('login')}>Login</Button>
        </div>
      </StyledCreateForm>

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

export default CreateAccount;