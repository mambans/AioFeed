import { Form, Button } from 'react-bootstrap';
import React, { useState, useContext } from 'react';

import AccountContext from './../../account/AccountContext';
import LoadingList from './../LoadingList';
import VodChannelListElement from './VodChannelListElement';
import useInput from './../../../hooks/useInput';
import AddVodChannel from './AddVodChannel';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { VodChannelListPopup } from './StyledComponents';

export default () => {
  const { authKey, username } = useContext(AccountContext);
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);
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
      AddVodChannel({ channel, channels, setChannels, username, authKey });

      resetchannel();
    }
  };

  return (
    <VodChannelListPopup>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId='formGroupChannel'>
          <Form.Control
            type='text'
            placeholder='Channel name..'
            required
            {...bindchannel}
            isInvalid={!channel}
            style={{ marginTop: '5px' }}
          />
          <Button type='submit' variant='primary' style={{ width: '100%', padding: '5px' }}>
            Add
          </Button>
        </Form.Group>
      </Form>
      {channels.length > 0 ? (
        <ul>
          {channels.map((channel) => (
            <VodChannelListElement key={channel} channel={channel} param_Channels={channels} />
          ))}
        </ul>
      ) : (
        <LoadingList amount={8} />
      )}
    </VodChannelListPopup>
  );
};
