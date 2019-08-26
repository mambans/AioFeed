import React from "react";
import Moment from "react-moment";

import styles from "./Twitch.module.scss";
import Utilities from "utilities/utilities";

class RenderTwitchVods extends React.Component {
    streamType(type) {
        if (type === "live") {
            return <div className={styles.liveDot} />;
        } else {
            return <p className={styles.type}>{this.props.data.stream_type}</p>;
        }
    }

    render() {
        return (
            <div className={styles.video}>
                <div className={styles.imgContainer}>
                    <a className={styles.img} href={this.props.data.url}>
                        <img
                            src={this.props.data.thumbnail_url
                                .replace("%{width}", 640)
                                .replace("%{height}", 360)}
                            alt={styles.thumbnail}
                        />
                    </a>
                    <p className={styles.duration}>
                        {this.props.data.duration
                            .replace("h", ":")
                            .replace("m", ":")
                            .replace("s", "")}
                    </p>
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
                    <p className={styles.game}>{this.props.data.type}</p>
                    {
                        <Moment className={styles.viewers} fromNow>
                            {this.props.data.published_at}
                        </Moment>
                    }
                </div>
            </div>
        );
    }
}
export default RenderTwitchVods;
