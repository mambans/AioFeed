import { Button } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import ErrorHandeling from "../Error/Error";

import Utilities from "utilities/utilities";
import styles from "./Twitch.module.scss";
import RenderTwitchVods from "./Render-Twitch-Vods";

import getFollowedChannels from "./getFollowedChannels";
import getFollowedVods from "./getFollowedVods";

function TwitchVods() {
    const [vods, setVods] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const followedChannels = useRef();

    function refresh() {
        console.log("Refreshing vods");
        getFollowedVods(followedChannels.current);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                followedChannels.current = await getFollowedChannels();

                const followedVods = await getFollowedVods(followedChannels.current);

                setVods(followedVods);
                setIsLoaded(true);
            } catch (error) {
                setError(error);
            }
        }

        fetchData();
    }, []);

    if (error) {
        return <ErrorHandeling data={error}></ErrorHandeling>;
    }
    if (!isLoaded) {
        return (
            <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    } else {
        console.log("Render vods: ", vods);
        return (
            <>
                <Button
                    variant="outline-secondary"
                    className={styles.refreshButton}
                    onClick={refresh}>
                    Reload
                </Button>
                <div className={styles.container}>
                    {vods.map(vod => {
                        return <RenderTwitchVods data={vod} key={vod.id} />;
                    })}
                </div>
            </>
        );
    }
}

export default TwitchVods;
