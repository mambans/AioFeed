import React from "react";
import Img from "react-image";
import Moment from "react-moment";

import "./Subscriptions.scss";
import placeholderImg from "./../../assets/images/placeholder.png";
import Utilities from "./../../utilities/utilities";
import getSubscriptionVideos from "./Subscriptions";

require("dotenv").config();

const axios = require("axios");

class Subscriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { Videos: null };
        this.title = "Subscriptions";
    }

    async getSubscriptionVideos() {
        console.log(1);
        console.log(process.env.API_KEY);

        try {
            console.log("REQEUST SENT");

            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/activities?part=snippet%2CcontentDetails&channelId=UCHiof82PvgZrXFF-BRMvGDg&maxResults=10&key=${API_KEY}`
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
        console.log(2);
    }

    Subscriptions() {
        this.componentDidMount();
        this.render();
    }

    componentDidMount() {
        getSubscriptionVideos();
        this.prepareRendering();
    }

    truncate(input, max) {
        if (input.length > max) return input.substring(0, max) + "..";
        else return input;
    }

    async prepareRendering() {
        let requestRes = await this.getSubscriptionVideos();

        this.setState({
            Videos: Object.values(requestRes.data.items).map(video => (
                // console.log("sd", video.snippet.thumbnails.maxres.url),
                <div className="video" key={video.contentDetails.upload.videoId}>
                    <a
                        className="video-img"
                        href={
                            `https://www.youtube.com/watch?v=` + video.contentDetails.upload.videoId
                        }>
                        <Img
                            // src={[video.snippet.thumbnails.maxres.url, placeholderImg]}
                            src={placeholderImg}
                            alt="video-thumbnail"
                            loader={
                                <div className="loading-div">
                                    <div className="lds-ripple">
                                        <div />
                                        <div />
                                    </div>
                                </div>
                            }
                        />
                    </a>
                    <h4 className="video-title">
                        <a
                            href={
                                `https://www.youtube.com/watch?v=` +
                                video.contentDetails.upload.videoId
                            }>
                            {Utilities.truncate(video.snippet.title, 50)}
                        </a>
                    </h4>
                    <Moment className="video-date" fromNow>
                        {video.snippet.publishedAt}
                    </Moment>
                    <p className="video-channel">
                        <a href={`https://www.youtube.com/channel/` + video.snippet.channelId}>
                            {video.snippet.channelTitle}
                        </a>
                    </p>
                </div>
            )),
        });
    }

    render() {
        return (
            <>
                <h2>{this.title}</h2>
                <div className="video-container">{this.state.Videos}</div>
            </>
        );
    }
}

export default Subscriptions;
