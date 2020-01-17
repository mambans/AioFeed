import { Button } from "react-bootstrap";
import { deleteIconic } from "react-icons-kit/iconic/deleteIconic";
import axios from "axios";
import Icon from "react-icons-kit";
import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import AccountContext from "./../../account/AccountContext";

import LoadingList from "./../LoadingList";

export default props => {
  const { authKey, username } = useContext(AccountContext);
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
          setValue(event.target.value);
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
      console.log(e.message);
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
    addChannel();
    resetchannel();
  };

  useEffect(() => {
    getChannels();

    return () => {
      if (reload.current === true) props.refresh(true);
    };
  }, [getChannels, props]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Add channel:
          <input type='text' placeholder='Channel name..' {...bindchannel} />
        </label>
        <input type='submit' value='Add' />
      </form>
      {channels.length > 0 ? (
        <ul>
          {channels.map(channel => {
            return (
              <li key={channel}>
                <p>{channel}</p>
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
