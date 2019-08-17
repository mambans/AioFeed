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
            <div className={styles.video} key={this.props.data._id}>
                <div className={styles.imgDurationContainer}>
                    <a className={styles.img} href={this.props.data.channel.url}>
                        <img
                            src={this.props.data.preview.large}
                            // src={placeholderImg}
                            alt={styles.thumbnail}
                        />
                    </a>
                    <Moment className={styles.duration} durationFromNow>
                        {this.props.data.created_at}
                    </Moment>
                    {this.streamType(this.props.data.stream_type)}
                </div>
                <h4 className={styles.title}>
                    <a href={this.props.data.channel.url}>
                        {Utilities.truncate(this.props.data.channel.status, 50)}
                    </a>
                </h4>
                <div>
                    <p className={styles.game}>
                        <a href={"https://www.twitch.tv/directory/game/" + this.props.data.game}>
                            {this.props.data.game}
                        </a>
                    </p>
                    <p className={styles.viewers}>{this.props.data.viewers}</p>
                    <p className={styles.channel}>
                        <a href={this.props.data.channel.url + "/videos"}>
                            {this.props.data.channel.name}
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

export default RenderTwitch;
