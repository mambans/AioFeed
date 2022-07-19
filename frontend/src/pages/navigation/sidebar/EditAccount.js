import React, { useContext, useReducer, useState } from 'react';
import { Breadcrumb, Button, Form, Modal, Spinner } from 'react-bootstrap';
import ToolTip from '../../../components/tooltip/ToolTip';
import { StyledAccountButton } from './StyledComponents';
import { MdModeEdit } from 'react-icons/md';
import useInput from '../../../hooks/useInput';
import styles from './Sidebar.module.scss';
import { ButtonGroup } from '../../../components/styledComponents';
import AccountContext from '../../account/AccountContext';
import DeleteAccount from '../../account/DeleteAccount';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import VerifyEmail from '../../account/VerifyEmail';

const EditAccount = () => {
  const [open, setOpen] = useState();
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
  const [openDelete, setOpenDelete] = useState();
  const [openVerifyCode, setOpenVerifyCode] = useState();
  const { user, setUser } = useContext(AccountContext);
  const [loading, setLoading] = useState();

  const handleToggle = () => {
    console.log('handleToggle:');
    setOpen((c) => !c);
  };

  const handleClose = () => {
    console.log('handleClose:');
    setOpen(false);
    setOpenDelete(false);
    resetPassword();
    resetNewPassword();
    resetNewPasswordConfirm();
  };

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const { value: username, bind: bindUsername } = useInput(user?.username || '');
  const { value: email, bind: bindEmail } = useInput(user?.attributes?.email || '');
  // eslint-disable-next-line no-unused-vars
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput('', null, () => setError(null));
  // eslint-disable-next-line no-unused-vars
  const { value: newPassword, bind: bindNewPassword, reset: resetNewPassword } = useInput('');
  const {
    // eslint-disable-next-line no-unused-vars
    value: newPasswordConfirm,
    bind: bindNewPasswordConfirm,
    reset: resetNewPasswordConfirm,
  } = useInput('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('username:', username);
    setError(null);
    setLoading(true);
    const updatedUserStatus = await Auth.updateUserAttributes(user, {
      email,
      // username,
    });

    setLoading(false);
    if (updatedUserStatus) {
      if (user.attributes.email !== email) {
        setOpenVerifyCode(true);
      }
      setUser(await Auth.currentAuthenticatedUser());
    }

    if (password && newPassword && newPasswordConfirm && newPassword === newPasswordConfirm) {
      try {
        const passwordChangedStatus = await Auth.changePassword(user, password, newPassword);
        if (passwordChangedStatus === 'SUCCESS') {
          toast.success('Successfully change password');
        }
      } catch (error) {
        setError(error);
        console.log('error:', error);
      }
    }
  };

  return (
    <>
      <ToolTip tooltip='Edit account'>
        <StyledAccountButton onClick={handleToggle} variant='secondary'>
          Edit account
          <MdModeEdit size={24} style={{ marginLeft: '0.75rem' }} />
        </StyledAccountButton>
      </ToolTip>
      <Modal
        show={open}
        onHide={handleClose}
        dialogClassName={styles.modal}
        backdropClassName={styles.modalBackdrop}
      >
        <Modal.Body>
          {openDelete ? (
            <DeleteAccount onClose={handleCloseDelete} />
          ) : openVerifyCode ? (
            <VerifyEmail onClose={() => setOpenVerifyCode(false)} />
          ) : (
            <>
              <Breadcrumb>
                <Breadcrumb.Item active>Edit</Breadcrumb.Item>
              </Breadcrumb>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control required placeholder='Username' {...bindUsername} disabled />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control required placeholder='Email' {...bindEmail} />
                </Form.Group>

                <Form.Group controlId='formBasicPassword'>
                  <Form.Label>Current password</Form.Label>
                  <Form.Control
                    required={newPassword && newPasswordConfirm}
                    type='password'
                    placeholder='Password'
                    {...bindPassword}
                    isInvalid={error}
                  />
                  <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId='formBasicNewPassword'>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter new password'
                    {...bindNewPassword}
                  />
                </Form.Group>
                <Form.Group controlId='formBasicNewPasswordConfirm' style={{ marginTop: 10 }}>
                  <Form.Control
                    type='password'
                    placeholder='Enter new password again'
                    {...bindNewPasswordConfirm}
                  />
                </Form.Group>
                <ButtonGroup justifyContent='space-between'>
                  <Button variant='primary' type='submit' disabled={loading}>
                    {loading ? <Spinner animation='border' role='status' /> : 'Save'}
                  </Button>
                  <Button variant='danger' onClick={handleOpenDelete}>
                    Delete
                  </Button>
                </ButtonGroup>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EditAccount;
