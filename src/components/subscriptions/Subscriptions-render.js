import React from "react";

import Moment from "react-moment";

import styles from "./Subscriptions.module.scss";
import Utilities from "./../../utilities/utilities";

const axios = require("axios");

class Subscriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { videos: null, loading: true, error: null };
        this.title = "Subscriptions";
    }

    async getSubscriptionVideos() {
        const videos = [];
        // eslint-disable-next-line
        let channels = {
            FastASMR: "UCHiof82PvgZrXFF-BRMvGDg",
            ASMRGlow: "UCFmL725KKPx2URVPvH3Gp8w",
            SiriusEyesASMR: "UCKzOQLe_60mhb0LPuKDSbCA",
            LinusTechTips: "UCXuqSBlHAE6Xw-yeJA0Tunw",
            GibiASMR: "UCE6acMV3m35znLcf0JGNn7Q",
            // Techquickie: "UC0vBXGSyV14uvJ4hECDOl0Q",
            // MovieClipsTrailers: "UCi8e0iOVk1fEOogdfu4YgfA",
        };

        let channelsArray = [
            "UCHiof82PvgZrXFF-BRMvGDg",
            "UCFmL725KKPx2URVPvH3Gp8w",
            "UCKzOQLe_60mhb0LPuKDSbCA",
            "UCXuqSBlHAE6Xw-yeJA0Tunw",
            "UCE6acMV3m35znLcf0JGNn7Q",
        ];

        // try {
        //     console.log("REQEUST SENT");

        //     const response = await axios.get(
        //         `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${
        //             channels.FastASMR
        //         }&maxResults=10&key=${process.env.REACT_APP_API_KEY}`
        //     );

        //     console.log(response);
        //     return response.data.items;
        // } catch (error) {
        //     console.error(error);
        // }

        try {
            await Promise.all(
                channelsArray.map(async channel => {
                    console.log("REQEUST SENT");
                    console.log("channel: ", channel);

                    const response = await axios.get(
                        `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${channel}&maxResults=5&key=${
                            process.env.REACT_APP_API_KEY
                        }`
                    );

                    let videosunfiltered = response.data.items.filter(video => {
                        return video.snippet.type === "upload";
                    });

                    videosunfiltered.forEach(element => {
                        videos.push(element);
                    });
                })
            );

            console.log("videos :", videos);
            this.setState({
                loading: false,
                videos,
            });
        } catch (error) {
            console.error(error);
            this.setState({
                loading: false,
                error,
            });
        }
    }

    componentDidMount() {
        this.getSubscriptionVideos();
    }

    render() {
        const { error, loading, videos } = this.state;
        if (error) {
            return (
                <div>
                    <p>Error: {error.message}</p>
                </div>
            );
        } else if (loading) {
            return (
                <div>
                    <p>Loading..</p>
                </div>
            );
        } else {
            return (
                <div className={styles.container}>
                    {Object.values(videos).map(video => (
                        // console.log("Thumnbails", video.snippet),
                        <div className={styles.video} key={video.contentDetails.upload.videoId}>
                            <a
                                className={styles.img}
                                href={
                                    `https://www.youtube.com/watch?v=` +
                                    video.contentDetails.upload.videoId
                                }>
                                <img
                                    src={Utilities.videoImageUrls(video.snippet.thumbnails)}
                                    // src={placeholderImg}
                                    alt={styles.thumbnail}
                                />
                            </a>
                            <h4 className={styles.title}>
                                <a
                                    href={
                                        `https://www.youtube.com/watch?v=` +
                                        video.contentDetails.upload.videoId
                                    }>
                                    {Utilities.truncate(video.snippet.title, 50)}
                                </a>
                            </h4>
                            <Moment className={styles.date} fromNow>
                                {video.snippet.publishedAt}
                            </Moment>
                            <p className={styles.channel}>
                                <a
                                    href={
                                        `https://www.youtube.com/channel/` + video.snippet.channelId
                                    }>
                                    {video.snippet.channelTitle}
                                </a>
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
    }
}

export default Subscriptions;
