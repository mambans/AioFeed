import React from "react";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

import Utilities from "utilities/utilities";

import styles from "./Twitch.module.scss";
import RenderTwitch from "./Render-Twitch";

class Twitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoaded: false,
            error: null,
            lastRan: null,
            runOnce: true,
            refreshing: false,
            refreshRate: 120,
        };
        this.title = "Twitch";
        this.thresholdDate = 1;
    }

    async getFollowedOnlineStreams() {
        try {
            let LiveFollowedStreams;
            const currentTime = new Date();
            // console.log("currentTime: ", currentTime);
            // console.log("lastRan: ", this.state.lastRan);
            // console.log("currentTime - lastRan: ", (currentTime - this.state.lastRan) / 1000);
            // console.log("runOnce: ", this.state.runOnce);

            // Only make requests each 2min.
            if (
                ((currentTime - this.state.lastRan) / 1000 >= this.state.refreshRate &&
                    this.state.lastRan != null) ||
                this.state.runOnce
            ) {
                console.log("Refreshing data");
                this.setState({
                    refreshing: true,
                    runOnce: false,
                });

                // GET all followed channels.
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

                // Gets data from second page when there are more than 50 followed channels.
                if (followedchannels.data.data.length < followedchannels.data.total) {
                    const secondPage = await axios.get(
                        `https://api.twitch.tv/helix/users/follows?`,
                        {
                            params: {
                                from_id: 32540540,
                                first: 50,
                                after: followedchannels.data.pagination.cursor,
                            },
                            headers: {
                                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                            },
                        }
                    );

                    secondPage.data.data.forEach(channel => {
                        followedchannels.data.data.push(channel);
                    });
                }

                // Make an array of all followed channels id's for easier/less API reuqests.
                const followedChannelsIds = followedchannels.data.data.map(channel => {
                    return channel.to_id;
                });

                // Get all Live-streams from followed channels.
                LiveFollowedStreams = await axios.get(`https://api.twitch.tv/helix/streams?`, {
                    params: {
                        user_id: followedChannelsIds,
                    },
                    headers: {
                        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    },
                });

                // Removes game id duplicates before sending game request.
                const games = [
                    ...new Set(
                        LiveFollowedStreams.data.data.map(channel => {
                            return channel.game_id;
                        })
                    ),
                ];

                // Get game names from their Id's.
                const gameNames = await axios.get(`https://api.twitch.tv/helix/games`, {
                    params: {
                        id: games,
                    },
                    headers: {
                        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    },
                });

                // Add the game name to each stream object.
                LiveFollowedStreams.data.data.map(stream => {
                    gameNames.data.data.find(game => {
                        return game.id === stream.game_id;
                    }) !== undefined
                        ? (stream.game_name = gameNames.data.data.find(game => {
                              return game.id === stream.game_id;
                          }).name)
                        : (stream.game_name = "");

                    return undefined;
                });

                // Filters out rerun streams (not live).
                // const FilteredLiveFollowedStreams = LiveFollowedStreams.data.data.filter(stream => {
                //     return stream.type === "live";
                // });

                const FilteredLiveFollowedStreams = LiveFollowedStreams.data.data;

                this.setState({
                    refreshing: false,
                });

                this.setState({
                    isLoaded: true,
                    data: FilteredLiveFollowedStreams,
                    lastRan: new Date(),
                });
            } else {
                console.log(
                    "Can auto refresh in " +
                        (this.state.refreshRate - (currentTime - this.state.lastRan) / 1000) +
                        " sec."
                );
                console.log(
                    "Since last refresh: " + (currentTime - this.state.lastRan) / 1000 + " sec"
                );
            }

            if (!this.state.lastRan) {
                this.setState({
                    lastRan: new Date(),
                });
            }
        } catch (error) {
            console.error("-Error: ", error.message);
            this.setState({
                error: error,
            });
        }
    }

    async TwitterHomeFeed() {
        const response = axios.get(`https://api.twitter.com/1.1/statuses/home_timeline.json`);

        console.log(response);
    }

    async subscriptionsWebhoks() {
        //FIXME: Fix webhooks.
        console.log("access_token: ", localStorage.getItem("access_token"));

        const response = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_SECRET}&grant_type=client_credentials`
        );

        // const response = axios.get(`https://api.twitch.tv/helix/webhooks/subscriptions`, {
        //     headers: {
        //         "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        //         Authorization: "Bearer" + localStorage.getItem("access_token"),
        //     },
        // });

        console.log("HOOK: ", response);
        localStorage.setItem(`bearer_token`, response.data.access_token);
        console.log("bearer_token: ", localStorage.getItem("bearer_token"));

        const webhooks = await axios.get(`https://api.twitch.tv/helix/webhooks/subscriptions`, {
            headers: {
                "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                Authorization: "Bearer" + localStorage.getItem("bearer_token"),
            },
        });

        console.log("webhooks: ", webhooks);
    }

    windowFocusHandler = () => {
        this.getFollowedOnlineStreams();
    };

    windowBlurHandler = () => {};

    async componentDidMount() {
        window.addEventListener("focus", this.windowFocusHandler);
        window.addEventListener("blur", this.windowBlurHandler);

        await this.getFollowedOnlineStreams();
        // await this.subscriptionsWebhoks();
        // await this.TwitterHomeFeed();
        // await this.getFollowedVods();
    }

    componentWillUnmount() {
        window.removeEventListener("blur", this.windowBlurHandler);
        window.removeEventListener("focus", this.windowFocusHandler);
    }

    render() {
        const { refreshing, isLoaded, data, error } = this.state;
        console.log("Final live-data:", data);

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
            return (
                <>
                    <Button
                        variant="outline-secondary"
                        className={styles.refreshButton}
                        onClick={this.windowFocusHandler}>
                        Reload
                    </Button>
                    {refreshing ? (
                        <Spinner
                            animation="border"
                            role="status"
                            style={Utilities.loadingSpinnerSmall}></Spinner>
                    ) : null}
                    <div className={styles.container}>
                        {data.map(streams => {
                            return <RenderTwitch data={streams} key={streams.id} />;
                        })}
                    </div>
                </>
            );
        }
    }
}

export default Twitch;
