import React from "react";
import Spinner from "react-bootstrap/Spinner";

import Utilities from "utilities/utilities";

import styles from "./Twitch.module.scss";
import RenderTwitch from "./Render-Twitch";

const axios = require("axios");

class Twitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: null, isLoaded: false, error: null, res: null };
        this.title = "Twitch";
    }

    // async getTopStreams() {
    //     try {
    //         console.log("Twitch REQEUST SENT");
    //         // console.log("channel: ", channel);

    //         const response = await axios.get(`https://api.twitch.tv/helix/streams?game_id=33214`,
    //         {
    //             headers: {
    //                 "Client-ID": process.env.TWITCH_CLIENT_ID,
    //             },
    //         }
    //         );

    //         // this.setState({
    //         //     res: response
    //         // })

    //         console.log("Twitch response: ", response);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    async getFollowedOnlineStreams() {
        console.log("getFollowedOnlineStreams");

        const response = await axios.get(`https://api.twitch.tv/kraken/streams/followed`, {
            params: {
                stream_type: "live",
                limit: 25,
            },
            headers: {
                Accept: "application/vnd.twitchtv.v5+json",
                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                // "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `OAuth ${localStorage.getItem("access_token")}`,
            },
        });

        console.log("Live: ", response);
        this.setState({
            isLoaded: true,
            data: response,
        });
    }

    async getFollowedVods() {
        console.log("Followed VODS");

        // const response = await axios.get(`https://api.twitch.tv/kraken/videos/followed`, {
        //     params: {
        //         broadcast_type: "archive",
        //         limit: 9,
        //     },
        //     headers: {
        //         Accept: "application/vnd.twitchtv.v5+json",
        //         "Client-ID": process.env.TWITCH_CLIENT_ID,
        //         Authorization: `OAuth ${localStorage.getItem("access_token")}`,
        //     },
        // });

        const response = await axios.get(`https://api.twitch.tv/kraken/streams/followed`, {
            params: {
                stream_type: "playlist",
            },
            headers: {
                Accept: "application/vnd.twitchtv.v5+json",
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `OAuth ${localStorage.getItem("access_token")}`,
            },
        });

        console.log("VODS: ", response);
    }

    componentDidMount() {
        // this.getTopStreams();
        this.getFollowedOnlineStreams();
        // this.getFollowedVods();
    }

    render() {
        const { isLoaded, data } = this.state;
        // Object.values().map(() => {});
        if (!isLoaded) {
            return (
                <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {
            return (
                <>
                    {/* <h3 className={styles.domainTitle}>{this.title}</h3> */}
                    <div className={styles.container}>
                        {data.data.streams.map(streams => {
                            return streams.stream_type === "live" ? (
                                <RenderTwitch data={streams} key={streams._id} />
                            ) : null;
                        })}
                    </div>
                </>
            );
        }
    }
}

export default Twitch;
