import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { Button } from "react-bootstrap";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import _ from "lodash";
import Moment from "react-moment";

import RenderYoutube from "./Render-Youtube";
import styles from "./Youtube.module.scss";
import Utilities from "utilities/utilities";

/**
 * TODO: FIXME: Reduce reuquests sent by Cashing or using Etag somehow. ERROR 304?
 */

class Youtube extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: null,
            isLoaded: false,
            error: null,
            followedChannels: [],
            refreshing: false,
            lastRefresh: null,
            lastRender: null,
        };
        this.title = "Youtube";
        this.thresholdDate = 3;
    }

    async getFollowChannels() {
        try {
            if (
                !localStorage.getItem(`followedChannels`) ||
                JSON.parse(localStorage.getItem(`followedChannels`)).casheExpire <= new Date()
            ) {
                console.log("------REQUEST SENT------");

                const firstPage = await axios.get(
                    `https://www.googleapis.com/youtube/v3/subscriptions?`,
                    {
                        params: {
                            maxResults: 50,
                            mine: true,
                            part: "snippet",
                            order: "relevance",
                            key: process.env.REACT_APP_YOUTUBE_API_KEY,
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("Youtube-access_token"),
                            Accept: "application/json",
                        },
                    }
                );

                const CheckNextPage =
                    firstPage.data.pageInfo.totalResults / firstPage.data.pageInfo.resultsPerPage;

                if (CheckNextPage >= 1) {
                    const secondPage = await axios.get(
                        `https://www.googleapis.com/youtube/v3/subscriptions?`,
                        {
                            params: {
                                maxResults: 50,
                                mine: true,
                                part: "snippet",
                                order: "relevance",
                                key: process.env.REACT_APP_YOUTUBE_API_KEY,
                                pageToken: firstPage.data.nextPageToken,
                            },
                            headers: {
                                Authorization:
                                    "Bearer " + localStorage.getItem("Youtube-access_token"),
                                Accept: "application/json",
                            },
                        }
                    );

                    console.log("TCL: getFollowChannels -> secondPage", secondPage);

                    let currentTime = new Date();

                    localStorage.setItem(
                        `followedChannels`,
                        JSON.stringify({
                            data: firstPage.data.items.concat(secondPage.data.items),
                            casheExpire: currentTime.setHours(currentTime.getHours() + 12),
                        })
                    );

                    console.log(
                        "followedChannels cache: ",
                        JSON.parse(localStorage.getItem(`followedChannels`))
                    );

                    this.setState({
                        followedChannels: JSON.parse(localStorage.getItem("followedChannels")).data,
                    });
                } else {
                    this.setState({
                        followedChannels: firstPage,
                    });
                }
            } else {
                console.log("------CACHE------");

                this.setState({
                    followedChannels: JSON.parse(localStorage.getItem("followedChannels")).data,
                });
            }

            console.log("All followed channels: ", this.state.followedChannels);
        } catch (e) {
            this.setState({
                error: e.message,
            });
            console.error("-Error: ", e);
        }
    }

    async GetLiveYoutubeStreams(channel) {
        try {
            console.log("--Param: Channel", channel);

            let liveStreams = [];
            let liveResponse = null;

            localStorage.getItem(`live-${channel}`)
                ? (liveResponse = await axios
                      .get(`https://www.googleapis.com/youtube/v3/search?`, {
                          params: {
                              part: "snippet",
                              channelId: channel,
                              eventType: "live",
                              maxResults: 1,
                              type: "video",
                              key: process.env.REACT_APP_YOUTUBE_API_KEY,
                          },
                          headers: {
                              "If-None-Match": JSON.parse(localStorage.getItem(`live-${channel}`))
                                  .data.etag,
                          },
                      })
                      .catch(function(error) {
                          console.log("Catch error");
                          console.error(error);
                          console.log(
                              "catch: ",
                              JSON.parse(localStorage.getItem(`live-${channel}`))
                          );
                          return JSON.parse(localStorage.getItem(`live-${channel}`));
                      }))
                : (liveResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?`, {
                      params: {
                          part: "snippet",
                          channelId: channel,
                          eventType: "live",
                          maxResults: 1,
                          type: "video",
                          key: process.env.REACT_APP_YOUTUBE_API_KEY,
                      },
                  }));

            localStorage.setItem(`live-${channel}`, JSON.stringify(liveResponse));

            console.log("LiveResonse: ", liveResponse);
            console.log(
                "LiveResonse- localstorage: ",
                JSON.parse(localStorage.getItem(`live-${channel}`))
            );

            // ----------------------------------------
            // const liveResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?`, {
            //     params: {
            //         part: "snippet",
            //         channelId: channel,
            //         eventType: "live",
            //         maxResults: 2,
            //         type: "video",
            //         key: process.env.REACT_APP_YOUTUBE_API_KEY,
            //     },
            // });

            // console.log("LiveResonse: ", liveResponse);

            // Adding live stremaing details.
            if (liveResponse.data.items.length >= 1) {
                console.log("GET: Livestrema details.");

                liveStreams = await Promise.all(
                    liveResponse.data.items.map(async stream => {
                        const liveDetailsResponse = await axios.get(
                            `https://www.googleapis.com/youtube/v3/videos?`,
                            {
                                params: {
                                    part: "liveStreamingDetails",
                                    id: stream.id.videoId,
                                    key: process.env.REACT_APP_YOUTUBE_API_KEY,
                                },
                            }
                        );

                        stream.snippet.publishedAt =
                            liveDetailsResponse.data.items[0].liveStreamingDetails.actualStartTime;

                        stream.df = "liveYoutube";

                        stream.duration =
                            liveDetailsResponse.data.items[0].liveStreamingDetails.actualStartTime;

                        stream.contentDetails = {
                            upload: {
                                videoId: stream.id.videoId,
                            },
                        };
                        return stream;
                    })
                );
            }
            return liveStreams;
        } catch (e) {
            console.error("-Error: ", e);
            this.setState({
                error: e.message,
            });
        }
    }

    async getSubscriptionVideos() {
        this.setState({
            refreshing: true,
        });
        const videosUnordered = [];
        const today = new Date();
        const OnlyVideosAfterDate = new Date();
        OnlyVideosAfterDate.setDate(today.getDate() - this.thresholdDate);

        let liveStreams = [];
        let videos = [];

        // eslint-disable-next-line
        let channels = {
            FastASMR: { snippet: { channelId: "UCHiof82PvgZrXFF-BRMvGDg" } },
            GibiASMR: { snippet: { channelId: "UCE6acMV3m35znLcf0JGNn7Q" } },
            ASMRKittyKlaw: { snippet: { channelId: "UCo-gAYrvd7WIrCRsNueddtQ" } },
            // LinusTechTips: "UCXuqSBlHAE6Xw-yeJA0Tunw",
            // GibiASMR: "UCE6acMV3m35znLcf0JGNn7Q",
            // Techquickie: "UC0vBXGSyV14uvJ4hECDOl0Q",
            // ASMRHoneyGirl: "UCGOuvU10ALr4adctUOekbDw",
            // ASMRKittyKlaw: "UCo-gAYrvd7WIrCRsNueddtQ",
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

        await this.getFollowChannels();

        console.log("---this.state.followedChannels:: ", this.state.followedChannels);

        try {
            await Promise.all(
                this.state.followedChannels.map(async channel => {
                    let response = null;

                    localStorage.getItem(`activity-${channel.snippet.resourceId.channelId}`)
                        ? (response = await axios
                              .get(`https://www.googleapis.com/youtube/v3/activities?`, {
                                  params: {
                                      part: "snippet,contentDetails",
                                      channelId: channel.snippet.resourceId.channelId,
                                      maxResults: 1,
                                      publishedAfter: OnlyVideosAfterDate.toISOString(),
                                      key: process.env.REACT_APP_YOUTUBE_API_KEY,
                                  },
                                  headers: {
                                      "If-None-Match": JSON.parse(
                                          localStorage.getItem(
                                              `activity-${channel.snippet.resourceId.channelId}`
                                          )
                                      ).data.etag,
                                  },
                              })
                              .catch(function(error) {
                                  return JSON.parse(
                                      localStorage.getItem(
                                          `activity-${channel.snippet.resourceId.channelId}`
                                      )
                                  );
                              }))
                        : (response = await axios.get(
                              `https://www.googleapis.com/youtube/v3/activities?`,
                              {
                                  params: {
                                      part: "snippet,contentDetails",
                                      channelId: channel.snippet.resourceId.channelId,
                                      maxResults: 1,
                                      publishedAfter: OnlyVideosAfterDate.toISOString(),
                                      key: process.env.REACT_APP_YOUTUBE_API_KEY,
                                  },
                              }
                          ));

                    localStorage.setItem(
                        `activity-${channel.snippet.resourceId.channelId}`,
                        JSON.stringify(response)
                    );

                    let videosfiltered = response.data.items.filter(video => {
                        return video.snippet.type === "upload";
                    });

                    videosfiltered.forEach(element => {
                        videosUnordered.push(element);
                    });

                    // let liveChannels = await this.GetLiveYoutubeStreams(channel.snippet.channelId);
                    // liveChannels.forEach(stream => {
                    //     liveStreams.push(stream);
                    // });

                    videos = videosUnordered;
                })
            );

            await this.getVideoInfo(videos);
            await liveStreams.forEach(ele => {
                videosUnordered.push(ele);
            });

            videos = _.reverse(_.sortBy(videosUnordered, d => d.snippet.publishedAt));

            this.setState({
                isLoaded: true,
                videos,
                refreshing: false,
                lastRefresh: new Date(),
                lastRender: new Date(),
            });
        } catch (error) {
            // console.error(error);
            this.setState({
                isLoaded: true,
                error,
            });
        }
    }

    async getVideoInfo(videoList) {
        await Promise.all(
            Object.values(videoList).map(async video => {
                let response = null;

                !localStorage.getItem(`videoDetails-${video.contentDetails.upload.videoId}`)
                    ? (response = await axios
                          .get(
                              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.contentDetails.upload.videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
                          )
                          .then(console.log("DETAILS SENT")))
                    : (response = JSON.parse(
                          localStorage.getItem(
                              `videoDetails-${video.contentDetails.upload.videoId}`
                          )
                      ));

                localStorage.setItem(
                    `videoDetails-${video.contentDetails.upload.videoId}`,
                    JSON.stringify(response)
                );

                videoList.find(videoo => {
                    return videoo.contentDetails.upload.videoId === response.data.items[0].id;
                }).duration = await Utilities.formatDuration(
                    response.data.items[0].contentDetails.duration
                );

                // videoList.find(videoo => {
                //     return videoo.contentDetails.upload.videoId === response.data.items[0].id;
                // }).duration = response.data.items[0].contentDetails.duration;
            })
        );
    }

    componentDidMount() {
        window.addEventListener("focus", this.windowFocusHandler);
        window.addEventListener("blur", this.windowBlurHandler);
        // this.getFollowChannels();

        this.getSubscriptionVideos();
    }

    componentWillUnmount() {
        window.removeEventListener("blur", this.windowBlurHandler);
        window.removeEventListener("focus", this.windowFocusHandler);
    }

    windowBlurHandler = () => {};

    windowFocusHandler = () => {
        // this.getSubscriptionVideos();
        this.setState({
            lastRender: new Date(),
        });
    };

    ButtonRun = () => {
        this.getSubscriptionVideos();
        this.setState({
            lastRender: new Date(),
        });
    };

    render() {
        const { videos, refreshing, lastRefresh, lastRender, error } = this.state;
        if (error) {
            return (
                <Alert variant="warning" style={Utilities.alertWarning}>
                    <Alert.Heading>Oh-oh! Something not so good happended.</Alert.Heading>
                    <hr />
                    <p>{error}</p>
                </Alert>
            );
        } else if (!this.state.isLoaded) {
            return (
                <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {
            console.log("FINAL: ", videos);
            return (
                <>
                    <Button
                        variant="outline-secondary"
                        className={styles.refreshButton}
                        onClick={this.ButtonRun}>
                        Reload
                    </Button>
                    {refreshing ? (
                        <Spinner
                            animation="border"
                            role="status"
                            style={Utilities.loadingSpinnerSmall}></Spinner>
                    ) : (
                        <Moment key={lastRender.getTime()} className={styles.lastRender} fromNow>
                            {lastRefresh}
                        </Moment>
                    )}
                    <div className={styles.container}>
                        {videos.map(video => {
                            return (
                                <RenderYoutube
                                    data={video}
                                    key={video.contentDetails.upload.videoId}
                                />
                            );
                        })}
                    </div>
                </>
            );
        }
    }
}

export default Youtube;
