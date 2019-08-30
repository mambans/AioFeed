import React from "react";

import styles from "./Twitch.module.scss";
import Utilities from "utilities/utilities";
import Moment from "react-moment";

class RenderTwitch extends React.Component {
    streamType(type) {
        if (type === "live") {
            return <div className={styles.liveDot} />;
        } else {
            return <p className={styles.type}>{this.props.data.stream_type}</p>;
        }
    }

    render() {
        return (
            <div className={styles.video} key={this.props.data.id}>
                <div className={styles.imgContainer}>
                    <a
                        className={styles.img}
                        // href={"https://www.twitch.tv/" + this.props.data.user_name.toLowerCase()}>
                        href={
                            "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                            this.props.data.user_name.toLowerCase()
                        }>
                        <img
                            src={
                                this.props.data.thumbnail_url
                                    .replace("{width}", 640)
                                    .replace("{height}", 360) +
                                `#` +
                                new Date().getTime()
                            }
                            alt={styles.thumbnail}
                        />
                    </a>
                    <Moment className={styles.duration} durationFromNow>
                        {this.props.data.started_at}
                    </Moment>
                    {this.streamType(this.props.data.type)}
                </div>
                <h4 className={styles.title}>
                    <a href={"https://www.twitch.tv/" + this.props.data.user_name.toLowerCase()}>
                        {Utilities.truncate(this.props.data.title, 50)}
                    </a>
                </h4>
                <div>
                    <p className={styles.channel}>
                        <a
                            href={
                                "https://www.twitch.tv/" +
                                this.props.data.user_name.toLowerCase() +
                                "/videos"
                            }>
                            {this.props.data.user_name}
                        </a>
                    </p>
                    <p className={styles.game}>
                        <a
                            href={
                                "https://www.twitch.tv/directory/game/" + this.props.data.game_name
                            }>
                            {this.props.data.game_name}
                        </a>
                    </p>
                    <p className={styles.viewers}>{this.props.data.viewer_count}</p>
                </div>
            </div>
        );
    }
}

export default RenderTwitch;
