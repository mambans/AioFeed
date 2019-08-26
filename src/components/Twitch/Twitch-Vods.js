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
            "윰찌니",
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
                    if (!localStorage.getItem(`${channel}-vod`)) {
                        console.log("REQ SENT");

                        response = await axios.get(`https://api.twitch.tv/helix/videos?`, {
                            params: {
                                user_id: channel,
                                first: 1,
                                period: "day",
                            },
                            headers: {
                                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                            },
                        });
                        localStorage.setItem(`${channel}-vod`, JSON.stringify(response));
                    } else {
                        console.log("Cashe used");

                        response = JSON.parse(localStorage.getItem(`${channel}-vod`));
                    }

                    followedStreamVods.push(response);
                })
            );

            let followedOrderedStreamVods = _.reverse(
                _.sortBy(followedStreamVods, d => d.data.data[0].published_at)
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

    async componentDidMount() {
        await this.getFollowedChannels();
        // await this.TwitterHomeFeed();
        await this.getFollowedVods();
    }

    render() {
        const { isLoaded, error, vods } = this.state;

        if (error) {
            return (
                <Alert variant="warning" style={Utilities.alertWarning}>
                    <Alert.Heading>Couldn't fetch the data required.</Alert.Heading>
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
                            return (
                                <RenderTwitchVods
                                    data={vod.data.data[0]}
                                    key={vod.data.data[0].id}
                                />
                            );
                        })}
                    </div>
                </>
            );
        }
    }
}

export default TwitchVods;
