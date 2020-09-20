import { Form, Button } from 'react-bootstrap';
import React, { useState, useContext } from 'react';

import AccountContext from './../../account/AccountContext';
import LoadingList from './../LoadingList';
import VodChannelListElement from './VodChannelListElement';
import useInput from './../../../hooks/useInput';
import AddVodChannel from './AddVodChannel';
import { getLocalstorage } from '../../../util/Utils';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';

export default () => {
  const { authKey, username } = useContext(AccountContext);
  const channels = getLocalstorage('TwitchVods-Channels') || [];
  const [validated, setValidated] = useState(false);
  const { value: channel, bind: bindchannel, reset: resetchannel } = useInput('');
  useLockBodyScroll(true);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      setValidated(true);
      AddVodChannel({ channel, channels, username, authKey });

      resetchannel();
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId='formGroupChannel'>
          <Form.Label style={{ width: '100%', textAlign: 'center' }}>
            Add channel:
            <Form.Text className='text-muted'>Twitch channel to fetch vods from.</Form.Text>
            <Form.Control
              type='text'
              placeholder='Channel name..'
              required
              {...bindchannel}
              isInvalid={!channel}
              style={{ marginTop: '5px' }}
            />
          </Form.Label>
          <Button type='submit' variant='primary' style={{ width: '100%', padding: '5px' }}>
            Add
          </Button>
        </Form.Group>
      </Form>
      {channels.length > 0 ? (
        <ul>
          {channels.map((channel) => {
            return (
              <VodChannelListElement key={channel} channel={channel} param_Channels={channels} />
            );
          })}
        </ul>
      ) : (
        <LoadingList amount={8} />
      )}
    </>
  );
};
