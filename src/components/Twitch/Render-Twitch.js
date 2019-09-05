import React, { useEffect } from "react";

import styles from "./Twitch.module.scss";
import Utilities from "utilities/utilities";
import Moment from "react-moment";

function RenderTwitch(data) {
    function streamType(type) {
        if (type === "live") {
            return <div className={styles.liveDot} />;
        } else {
            return <p className={styles.type}>{data.data.stream_type}</p>;
        }
    }

    return (
        <div className={styles.video} key={data.data.id}>
            <div className={styles.imgContainer}>
                <a
                    className={styles.img}
                    // href={"https://www.twitch.tv/" + this.props.data.data.user_name.toLowerCase()}>
                    href={
                        "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                        data.data.user_name.toLowerCase()
                    }>
                    <img
                        src={
                            data.data.thumbnail_url
                                .replace("{width}", 640)
                                .replace("{height}", 360) +
                            `#` +
                            new Date().getTime()
                        }
                        alt={styles.thumbnail}
                    />
                </a>
                <Moment className={styles.duration} durationFromNow>
                    {data.data.started_at}
                </Moment>
                {streamType(data.data.type)}
            </div>
            <h4 className={styles.title}>
                <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
                    {Utilities.truncate(data.data.title, 50)}
                </a>
            </h4>
            <div>
                <div className={styles.channelContainer}>
                    <a
                        href={
                            "https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"
                        }>
                        <img
                            src={data.data.profile_img_url}
                            alt=""
                            className={styles.profile_img}></img>
                    </a>
                    <p className={styles.channel}>
                        <a
                            href={
                                "https://www.twitch.tv/" +
                                data.data.user_name.toLowerCase() +
                                "/videos"
                            }>
                            {data.data.user_name}
                        </a>
                    </p>
                </div>
                <div className={styles.gameContainer}>
                    <a href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
                        <img
                            src={data.data.game_img
                                .replace("{width}", 130)
                                .replace("{height}", 173)}
                            alt=""
                            className={styles.game_img}></img>
                    </a>
                    <p className={styles.game}>
                        <a href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
                            {data.data.game_name}
                        </a>
                    </p>
                    <p className={styles.viewers}>{data.data.viewer_count}</p>
                </div>
            </div>
        </div>
    );
}

export default RenderTwitch;
