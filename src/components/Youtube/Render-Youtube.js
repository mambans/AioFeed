import Moment from "react-moment";
import React from "react";

import Utilities from "utilities/utilities";
import styles from "./Youtube.module.scss";

class RenderYoutube extends React.Component {
    streamType(type) {
        if (type === "liveYoutube") {
            return <div className={styles.liveDot} />;
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={styles.video} key={this.props.data.contentDetails.upload.videoId}>
                <div className={styles.imgContainer}>
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
                    {this.props.data.df === "liveYoutube" ? (
                        <Moment className={styles.duration} durationFromNow>
                            {this.props.data.duration}
                        </Moment>
                    ) : (
                        <p className={styles.duration}>{this.props.data.duration}</p>
                    )}
                    {this.streamType(this.props.data.df)}
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
