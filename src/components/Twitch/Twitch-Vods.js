import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { Button } from "react-bootstrap";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import _ from "lodash";

import Utilities from "utilities/utilities";
import styles from "./Twitch.module.scss";
import RenderTwitchVods from "./Render-Twitch-Vods";

class TwitchVods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vods: [],
            isLoaded: false,
            error: null,
            FollowedChannels: [],
        };
        this.title = "Twitchccc";
        this.thresholdDate = 1;
    }

    async getFollowedChannels() {
        try {
            const followedchannels = await axios
                .get(`https://api.twitch.tv/helix/users/follows?`, {
                    params: {
                        from_id: 32540540,
                        first: 50,
                    },
                    headers: {
                        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    },
                })
                .catch(error => {
                    console.error("-Error: ", error.message);
                    this.setState({
                        error: error,
                    });
                });

            if (followedchannels.data.data.length < followedchannels.data.total) {
                const secondPage = await axios.get(`https://api.twitch.tv/helix/users/follows?`, {
                    params: {
                        from_id: 32540540,
                        first: 50,
                        after: followedchannels.data.pagination.cursor,
                    },
                    headers: {
                        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    },
                });

                secondPage.data.data.forEach(channel => {
                    followedchannels.data.data.push(channel);
                });
            }

            this.setState({
                FollowedChannels: followedchannels,
            });
        } catch (error) {
            console.error("-Error: ", error.message);
            this.setState({
                error: error,
            });
        }
    }

    async getFollowedVods() {
        const FollowChannelVods = [
            "sodapoppin",
            "dizzykitten",
            "nmplol",
            "yourpelagea",
            "jakenbakelive",
            "malena_tudi",
        ];
        const followedStreamVods = [];
        const today = new Date();
        const OnlyVodsAfterDate = new Date();
        OnlyVodsAfterDate.setDate(today.getDate() - this.thresholdDate);

        try {
            const vodChannels = this.state.FollowedChannels.data.data
                .map(channel => {
                    if (FollowChannelVods.includes(channel.to_name.toLowerCase())) {
                        return channel.to_id;
                    }
                    return null;
                })
                .filter(channel => {
                    return channel !== null;
                });

            let response = null;
            await Promise.all(
                vodChannels.map(async channel => {
                    if (
                        !localStorage.getItem(`${channel}-vod`) ||
                        JSON.parse(localStorage.getItem(`${channel}-vod`)).casheExpire <= new Date()
                    ) {
                        console.log("REQ SENT");

                        response = await axios.get(`https://api.twitch.tv/helix/videos?`, {
                            params: {
                                user_id: channel,
                                first: 2,
                                period: "week",
                                type: "archive",
                            },
                            headers: {
                                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                            },
                        });

                        let currentTime = new Date();
                        response.casheExpire = currentTime.setHours(currentTime.getHours() + 12);
                        localStorage.setItem(`${channel}-vod`, JSON.stringify(response));
                    } else {
                        console.log("Cashe used");
                        console.log(
                            "cashe expire in : ",
                            (JSON.parse(localStorage.getItem(`${channel}-vod`)).casheExpire -
                                new Date()) /
                                1000 /
                                60 /
                                60
                        );
                        response = JSON.parse(localStorage.getItem(`${channel}-vod`));
                    }

                    response.data.data.forEach(vod => {
                        followedStreamVods.push(vod);
                    });

                    // followedStreamVods.push(response.data.data);
                })
            );

            let followedOrderedStreamVods = _.reverse(
                _.sortBy(followedStreamVods, d => d.published_at)
            );

            this.setState({
                vods: followedOrderedStreamVods,
                isLoaded: true,
            });
        } catch (error) {
            console.error("-Error: ", error.message);
            this.setState({
                error: error,
            });
        }
    }

    refresh = () => {
        console.log("refresh vods");
        this.getFollowedVods();
    };

    getVodMarkers() {
        const response = axios.get(`https://api.twitch.tv/helix/streams/markers`, {
            params: {
                video_id: "472417730",
            },
            headers: {
                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                Authorization: "Bearer " + localStorage.getItem("bearer_token"),
            },
        });

        console.log(response);
    }

    async componentDidMount() {
        await this.getFollowedChannels();
        // await this.TwitterHomeFeed();
        await this.getFollowedVods();
        // await this.getVodMarkers();
    }

    render() {
        const { isLoaded, error, vods } = this.state;

        if (error) {
            return (
                <Alert variant="warning" style={Utilities.alertWarning}>
                    <Alert.Heading>Oh-oh! Something not so good happended.</Alert.Heading>
                    <hr />
                    {error.message}
                </Alert>
            );
        } else if (!isLoaded) {
            return (
                <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {
            console.log("Final vods: ", vods);

            return (
                <>
                    <Button
                        variant="outline-secondary"
                        className={styles.refreshButton}
                        onClick={this.refresh}>
                        Reload
                    </Button>
                    <div className={styles.container}>
                        {vods.map(vod => {
                            return <RenderTwitchVods data={vod} key={vod.id} />;
                        })}
                    </div>
                </>
            );
        }
    }
}

export default TwitchVods;
