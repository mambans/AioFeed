import React from "react";

import styles from "./Youtube.module.scss";
import Utilities from "utilities/utilities";
import Moment from "react-moment";

class RenderYoutube extends React.Component {
    render() {
        return (
            <div className={styles.video} key={this.props.data.contentDetails.upload.videoId}>
                <div className={styles.imgDurationContainer}>
                    <a
                        className={styles.img}
                        href={
                            `https://www.youtube.com/watch?v=` +
                            this.props.data.contentDetails.upload.videoId
                        }>
                        <img
                            src={Utilities.videoImageUrls(this.props.data.snippet.thumbnails)}
                            // src={placeholderImg}
                            alt={styles.thumbnail}
                        />
                    </a>
                    <p className={styles.duration}>{this.props.data.duration}</p>
                </div>
                <h4 className={styles.title}>
                    <a
                        href={
                            `https://www.youtube.com/watch?v=` +
                            this.props.data.contentDetails.upload.videoId
                        }>
                        {Utilities.truncate(this.props.data.snippet.title, 50)}
                    </a>
                </h4>
                {/* {this.props.data.df === "liveYoutube" ? (
                    <Moment className={styles.date} durationFromNow>
                        {this.props.data.snippet.publishedAt}
                    </Moment>
                ) : (
                    <Moment className={styles.date} fromNow>
                        {this.props.data.snippet.publishedAt}
                    </Moment>
                )} */}
                <Moment className={styles.date} fromNow>
                    {this.props.data.snippet.publishedAt}
                </Moment>
                <p className={styles.channel}>
                    <a
                        href={
                            `https://www.youtube.com/channel/` + this.props.data.snippet.channelId
                        }>
                        {this.props.data.snippet.channelTitle}
                    </a>
                </p>
            </div>
        );
    }
}

export default RenderYoutube;
