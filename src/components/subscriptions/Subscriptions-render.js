import React from "react";

import Moment from "react-moment";
import _ from "lodash";

import styles from "./Subscriptions.module.scss";
import Utilities from "./../../utilities/utilities";

const axios = require("axios");

class Subscriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { videos: null, isLoaded: false, error: null };
        this.title = "Subscriptions";
    }

    async getSubscriptionVideos() {
        const videos = [];
        // eslint-disable-next-line
        let channels = {
            FastASMR: "UCHiof82PvgZrXFF-BRMvGDg",
            // ASMRGlow: "UCFmL725KKPx2URVPvH3Gp8w",
            // SiriusEyesASMR: "UCKzOQLe_60mhb0LPuKDSbCA",
            // LinusTechTips: "UCXuqSBlHAE6Xw-yeJA0Tunw",
            // GibiASMR: "UCE6acMV3m35znLcf0JGNn7Q",
            // Techquickie: "UC0vBXGSyV14uvJ4hECDOl0Q",
            // MovieClipsTrailers: "UCi8e0iOVk1fEOogdfu4YgfA",
            // JayzTwoCents: "UCkWQ0gDrqOCarmUKmppD7GQ",
            // ASMRCham: "UCRz3cGfqeMPSHMBN6CxKQ9w",
            // ASMRSurge: "UCIKOy_q2VWDv1vzeoi7KgNw",
            // Sodapoppin: "UCtu2BCnJoFGRBOuIh570QWw",
            // Moona: "UCKpnB4SQuE6YqfHMleVNn_w",
            // LoganPaulVlogs: "UCG8rbF3g2AMX70yOd8vqIZg",
            // Impaulsive: "UCGeBogGDZ9W3dsGx-mWQGJA",
            // MrBeast: "UCX6OQ3DkcsbYNE6H8uQQuVA",
            // PrimitiveTechnology: "UCAL3JXZSzSm8AlZyD3nQdBA",
        };

        try {
            await Promise.all(
                Object.values(channels).map(async channel => {
                    console.log("REQEUST SENT");
                    console.log("channel: ", channel);

                    const response = await axios.get(
                        `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${channel}&maxResults=8&key=${
                            process.env.REACT_APP_API_KEY
                        }`
                    );

                    console.log("response: ", response);

                    let videosunfiltered = response.data.items.filter(video => {
                        return video.snippet.type === "upload";
                    });

                    videosunfiltered.forEach(element => {
                        videos.push(element);
                    });

                    // FIX SORT
                    _.sortBy(videos, [
                        function(o) {
                            return o.snippet.publishedAt;
                        },
                    ]);
                })
            );

            await this.getVideoInfo(videos);

            console.log("videos :", videos);
            this.setState({
                isLoaded: true,
                videos,
            });
        } catch (error) {
            console.error(error);
            this.setState({
                isLoaded: true,
                error,
            });
        }
    }

    async getVideoInfo(videoList) {
        await Promise.all(
            Object.values(videoList).map(async video => {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatus&id=${
                        video.contentDetails.upload.videoId
                    }&key=${process.env.REACT_APP_API_KEY}`
                );

                // console.log("Video details response: ", response);

                videoList.find(videoo => {
                    return videoo.contentDetails.upload.videoId === response.data.items[0].id;
                }).duration = Utilities.formatDuration(
                    response.data.items[0].contentDetails.duration
                );
            })
        );
    }

    componentDidMount() {
        this.getSubscriptionVideos();
    }

    render() {
        console.log("RENDERING");

        const { error, isLoaded, videos } = this.state;
        if (error) {
            return (
                <div>
                    <p>Error: {error.message}</p>
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div>
                    <p>Loading..</p>
                </div>
            );
        } else {
            return (
                <div className={styles.container}>
                    {Object.values(videos).map(video => (
                        <div className={styles.video} key={video.contentDetails.upload.videoId}>
                            <div className={styles.imgDurationContainer}>
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
                                <p className={styles.duration}>{video.duration}</p>
                            </div>
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
