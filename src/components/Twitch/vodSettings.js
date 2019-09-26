import axios from "axios";
// eslint-disable-next-line
import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";

import Utilities from "./../../utilities/Utilities";
import "./Twitch.scss";

function AddChannelForm() {
  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
        },
      },
    };
  };

  const [channels, setChannels] = useState();
  const { value: channel, bind: bindchannel, reset: resetchannel } = useInput("");

  async function addChannel() {
    try {
      await axios.post(`http://localhost:3100/notifies/vod-channels`, {
        channelName: channel,
      });

      getChannels();
    } catch (e) {
      console.log(e.message);
    }
  }

  async function removeChannel(channel) {
    try {
      await axios.delete(`http://localhost:3100/notifies/vod-channels`, {
        data: {
          channelName: channel,
        },
      });

      getChannels();
    } catch (e) {
      console.log(e.message);
    }
  }

  async function getChannels() {
    setChannels(await axios.get(`http://localhost:3100/notifies/vod-channels`));
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    addChannel();
    resetchannel();
  };

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <>
      {channels ? (
        <ul>
          {channels.data.channels.map(channel => {
            return (
              <li key={channel.name}>
                <p>{channel.name}</p>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => {
                    removeChannel(channel.name);
                  }}>
                  X
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Spinner animation='border' role='status' style={Utilities.loadingSpinner}>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Add channel:
          <input type='text' placeholder='Channel name..' {...bindchannel} />
        </label>
        <input type='submit' value='Add' />
      </form>
    </>
  );
}

export default AddChannelForm;
