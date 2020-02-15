import { deleteIconic } from "react-icons-kit/iconic/deleteIconic";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Icon from "react-icons-kit";
import React, { useEffect, useState, useRef, useCallback, useContext } from "react";

import AccountContext from "./../../account/AccountContext";
import LoadingList from "./../LoadingList";

export default props => {
  const { authKey, username } = useContext(AccountContext);
  const [validated, setValidated] = useState(false);
  const reload = useRef(false);

  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value.trim());
        },
      },
    };
  };

  const [channels, setChannels] = useState([]);
  const { value: channel, bind: bindchannel, reset: resetchannel } = useInput("");

  async function addChannel() {
    channels.unshift(channel);

    await axios
      .put(
        `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
        {
          username: username,
          authkey: authKey,
          channels: channels,
        }
      )
      .then(res => {
        setChannels(res.data);
        reload.current = true;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function removeChannel(channel) {
    try {
      const index = channels.indexOf(channel);
      channels.splice(index, 1);

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: channels,
          }
        )
        .then(res => {
          setChannels(res.data);
          reload.current = true;
        })
        .catch(err => {
          console.error(err);
        });
    } catch (e) {
      console.error(e.message);
    }
  }

  const getChannels = useCallback(async () => {
    const monitoredChannels = await axios
      .get(
        `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/fetch`,
        {
          params: {
            username: username,
            authkey: authKey,
          },
        }
      )
      .then(res => {
        // reload.current = true;
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
    setChannels(monitoredChannels);
  }, [authKey, username]);

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

  useEffect(() => {
    getChannels();

    return () => {
      if (reload.current === true) props.refresh(true);
    };
  }, [getChannels, props]);

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
              <li key={channel}>
                <Link to={"/twitch/channel/" + channel}>{channel}</Link>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => {
                    removeChannel(channel);
                  }}>
                  <Icon icon={deleteIconic} size={24}></Icon>
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <LoadingList amount={8} />
      )}
    </>
  );
};
