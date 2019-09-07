import axios from "axios";
import React from "react";
import { Button, Spinner } from "react-bootstrap";

import Utilities from "./../../utilities/Utilities";
import "./Twitch.scss";

class AddChannelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", channels: null };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async addChannel() {
    try {
      await axios.post(`http://localhost:3100/notifies/vod-channels`, {
        channelName: this.state.value,
      });

      const channels = await axios.get(`http://localhost:3100/notifies/vod-channels`);

      this.setState({
        channels,
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  async removeChannel(channel) {
    try {
      await axios.delete(`http://localhost:3100/notifies/vod-channels`, {
        data: {
          channelName: channel,
        },
      });

      this.setState({
        channels: await axios.get(`http://localhost:3100/notifies/vod-channels`),
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.addChannel(this.state.value);

    event.preventDefault();
  }

  async componentDidMount() {
    this.setState({
      channels: await axios.get(`http://localhost:3100/notifies/vod-channels`),
    });
  }

  render() {
    return (
      <>
        <ul>
          {this.state.channels ? (
            this.state.channels.data.channels.map(channel => {
              return (
                <li key={channel.name}>
                  <p>{channel.name}</p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      this.removeChannel(channel.name);
                    }}>
                    X
                  </Button>
                </li>
              );
            })
          ) : (
            <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <label>
            Add channel:
            <input
              type="text"
              placeholder="Channel name.."
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </>
    );
  }
}

export default AddChannelForm;
