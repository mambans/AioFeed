import React from "react";

import RenderYoutube from "./Render-Youtube";
import styles from "./Youtube.module.scss";
import Spinner from "react-bootstrap/Spinner";

import _ from "lodash";

// Own modules
import Utilities from "utilities/utilities";

const axios = require("axios");

class Youtube extends React.Component {
    constructor(props) {
        super(props);
        this.state = { videos: null, isLoaded: false, error: null, data: {} };
        this.title = "Youtube";
        this.thresholdDate = 3;
    }

    async getSubscriptionVideos() {
        const videosUnordered = [];
        const asd = [];
        let videos = [];

        const today = new Date();
        const OnlyVideosAfterDate = new Date();
        OnlyVideosAfterDate.setDate(today.getDate() - this.thresholdDate);

        // eslint-disable-next-line
        let channels = {
            FastASMR: "UCHiof82PvgZrXFF-BRMvGDg",
            LinusTechTips: "UCXuqSBlHAE6Xw-yeJA0Tunw",
            GibiASMR: "UCE6acMV3m35znLcf0JGNn7Q",
            Techquickie: "UC0vBXGSyV14uvJ4hECDOl0Q",
            // SiriusEyesASMR: "UCKzOQLe_60mhb0LPuKDSbCA",
            // ASMRGlow: "UCFmL725KKPx2URVPvH3Gp8w",
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
                    const response = await axios.get(
                        `https://www.googleapis.com/youtube/v3/activities?`,
                        {
                            params: {
                                part: "snippet,contentDetails",
                                channelId: channel,
                                maxResults: 10,
                                publishedAfter: OnlyVideosAfterDate.toISOString(),
                                key: process.env.REACT_APP_API_KEY,
                            },
                        }
                    );

                    // const liveResponse = await axios.get(
                    //     `https://www.googleapis.com/youtube/v3/search?`,
                    //     {
                    //         params: {
                    //             part: "snippet",
                    //             channelId: channel,
                    //             eventType: "live",
                    //             maxResults: 10,
                    //             type: "video",
                    //             key: process.env.REACT_APP_API_KEY,
                    //         },
                    //     }
                    // );

                    // console.log("LiveResonse: ", liveResponse);

                    // const response = await axios.get(
                    //     `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=${channel}&maxResults=10&&publishedAfter=${OnlyVideosAfterDate.toISOString()}&key=${
                    //         process.env.REACT_APP_API_KEY
                    //     }`
                    // );

                    let videosunfiltered = response.data.items.filter(video => {
                        return video.snippet.type === "upload";
                    });

                    videosunfiltered.forEach(element => {
                        videosUnordered.push(element);
                    });

                    // if (liveResponse.data.items.length > 0) {
                    //     liveResponse.data.items.forEach(stream => {
                    //         stream.contentDetails = {
                    //             upload: {
                    //                 videoId: stream.id.videoId,
                    //             },
                    //         };

                    //         //FIXME: Fix duration
                    //         stream.duration = stream.snippet.publishedAt;
                    //         stream.df = "liveYoutube";

                    //         console.log("sss: ", stream);

                    //         asd.push(stream);
                    //     });
                    // }

                    videos = _.reverse(_.sortBy(videosUnordered, d => d.snippet.publishedAt));

                    // console.log(asd);

                    this.setState({
                        data: {
                            type: "youtube",
                            videos: videos,
                        },
                    });
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
                    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${
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
        // this.getTopStreams();
        // this.getFollowedOnlineStreams();
        this.getSubscriptionVideos();
    }

    render() {
        const { videos } = this.state;
        if (!this.state.isLoaded) {
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
                        {videos.map(video => {
                            return <RenderYoutube data={video} />;
                        })}
                    </div>
                </>
            );
        }
    }

    // render(data) {
    //     return (
    //         <div className={styles.container}>
    //             {/* <p>{twitchTop.statusText}</p> */}
    //             <p>{data.type}</p>
    //             {Object.values(data.videos).map(video => (
    //                 <div className={styles.video} key={video.contentDetails.upload.videoId}>
    //                     <div className={styles.imgDurationContainer}>
    //                         <a
    //                             className={styles.img}
    //                             href={
    //                                 `https://www.youtube.com/watch?v=` +
    //                                 video.contentDetails.upload.videoId
    //                             }>
    //                             <img
    //                                 src={Utilities.videoImageUrls(video.snippet.thumbnails)}
    //                                 // src={placeholderImg}
    //                                 alt={styles.thumbnail}
    //                             />
    //                         </a>
    //                         <p className={styles.duration}>{video.duration}</p>
    //                     </div>
    //                     <h4 className={styles.title}>
    //                         <a
    //                             href={
    //                                 `https://www.youtube.com/watch?v=` +
    //                                 video.contentDetails.upload.videoId
    //                             }>
    //                             {Utilities.truncate(video.snippet.title, 50)}
    //                         </a>
    //                     </h4>
    //                     <Moment className={styles.date} fromNow>
    //                         {video.snippet.publishedAt}
    //                     </Moment>
    //                     <p className={styles.channel}>
    //                         <a href={`https://www.youtube.com/channel/` + video.snippet.channelId}>
    //                             {video.snippet.channelTitle}
    //                         </a>
    //                     </p>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // }
}

export default Youtube;
