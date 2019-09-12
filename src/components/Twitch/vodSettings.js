import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";

import Utilities from "./../../utilities/Utilities";
import "./Twitch.scss";

// function AddChannelForm() {
//   const [channels, setChannels] = useState();
//   const [value, setValue] = useState("");

//   async function removeChannel(channel) {
//     try {
//       await axios.delete(`http://localhost:3100/notifies/vod-channels`, {
//         data: {
//           channelName: channel,
//         },
//       });

//       setChannels(await axios.get(`http://localhost:3100/notifies/vod-channels`));
//     } catch (e) {
//       console.log(e.message);
//     }
//   }

//   const handleChange = useCallback(event => {
//     console.log(event);
//     console.log(event.target.value);

//     setValue({ value: event.target.value });
//   }, []);

//   // function handleChange(event) {
//   //   console.log(event);
//   //   console.log(event.target.value);

//   //   setValue(event.target.value);
//   // }

//   const handleSubmit = useCallback(() => {
//     async function addChannel() {
//       try {
//         await axios.post(`http://localhost:3100/notifies/vod-channels`, {
//           channelName: value,
//         });

//         const channels = await axios.get(`http://localhost:3100/notifies/vod-channels`);

//         setChannels(channels);
//       } catch (e) {
//         console.log(e.message);
//       }
//     }

//     addChannel();
//   }, [value]);

//   const getChannels = useCallback(async () => {
//     const vodChannels = await axios.get(`http://localhost:3100/notifies/vod-channels`);
//     setChannels(vodChannels);
//   }, []);

//   useEffect(() => {
//     getChannels();
//   }, [getChannels]);

//   return (
//     <>
//       {channels ? (
//         <ul>
//           {channels.data.channels.map(channel => {
//             return (
//               <li key={channel.name}>
//                 <p>{channel.name}</p>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => {
//                     removeChannel(channel.name);
//                   }}>
//                   X
//                 </Button>
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
//           <span className="sr-only">Loading...</span>
//         </Spinner>
//       )}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Add channel:
//           <input type="text" placeholder="Channel name.." value={value} onChange={handleChange} />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     </>
//   );
// }

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
    console.log(event.target.value);
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log(this.state.value);

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
        {this.state.channels ? (
          <ul>
            {this.state.channels.data.channels.map(channel => {
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
            })}
          </ul>
        ) : (
          <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}

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
