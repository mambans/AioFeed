import { Form, Button } from "react-bootstrap";
import axios from "axios";
import React, { useState, useContext } from "react";

import AccountContext from "./../../account/AccountContext";
import LoadingList from "./../LoadingList";
import VodChannelListElement from "./VodChannelListElement";
import useInput from "./../../useInput";
import VodsContext from "./VodsContext";

export default () => {
  const { authKey, username } = useContext(AccountContext);
  const { channels, setChannels } = useContext(VodsContext);
  const [validated, setValidated] = useState(false);
  const { value: channel, bind: bindchannel, reset: resetchannel } = useInput("");

  async function addChannel() {
    channels.unshift(channel);
    setChannels([...channels]);

    await axios
      .put(
        `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
        {
          username: username,
          authkey: authKey,
          channels: channels,
        }
      )
      .then(res => {})
      .catch(error => {
        console.error(error);
      });
  }

  async function removeChannel(channel) {
    try {
      const index = channels.indexOf(channel);
      channels.splice(index, 1);
      setChannels([...channels]);

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: channels,
          }
        )
        .then(res => {})
        .catch(err => {
          console.error(err);
        });
    } catch (e) {
      console.error(e.message);
    }
  }

  const handleSubmit = evt => {
    evt.preventDefault();

    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      setValidated(true);
      addChannel();
      resetchannel();
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId='formGroupChannel'>
          <Form.Label style={{ width: "100%", textAlign: "center" }}>
            Add channel:
            <Form.Text className='text-muted'>Twitch channel to fetch vods from.</Form.Text>
            <Form.Control
              type='text'
              placeholder='Channel name..'
              required
              {...bindchannel}
              isInvalid={!channel}
              style={{ marginTop: "5px" }}
            />
          </Form.Label>
          <Button type='submit' variant='primary' style={{ width: "100%", padding: "5px" }}>
            Add
          </Button>
        </Form.Group>
      </Form>
      {channels.length > 0 ? (
        <ul>
          {channels.map(channel => {
            return (
              <VodChannelListElement
                key={channel}
                channel={channel}
                removeChannel={removeChannel}
              />
            );
          })}
        </ul>
      ) : (
        <LoadingList amount={8} />
      )}
    </>
  );
};
