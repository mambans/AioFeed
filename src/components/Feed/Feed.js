import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

// Own modules
import styles from "./Feed.module.scss";
import Utilities from "utilities/utilities";
// import Twitch from "components/Twitch/Twitch";

import Youtube from "./../Youtube/Youtube";
import Twitch from "./../Twitch/Twitch";

/**
 * TODO: -Cache reuqeusts and find a way to check if you wanna do a new reuqest or not.
 *  TODO: -Fråga dennis, Hur kan jag använda process.env.TWITCH_CLIENT_ID i en extern url?
 */
class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded: true, error: null };
        this.title = "Feed";
        this.thresholdDate = 3;
    }

    componentDidMount() {
        // this.getTopStreams();
        // this.getFollowedOnlineStreams();
        // this.getSubscriptionVideos();
    }

    render() {
        console.log("-Rendering-");

        const { error, isLoaded } = this.state;
        if (error) {
            return (
                <Alert variant="warning" style={Utilities.alertWarning}>
                    <Alert.Heading>Couldn't fetch the data required.</Alert.Heading>
                    <hr />
                    {error.message}
                </Alert>
            );
        } else if (!isLoaded) {
            return (
                <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {
            return (
                <>
                    <Twitch />
                    <div className={styles.lineBreak} />
                    {/* <Youtube /> */}
                </>
            );
        }
    }
}

export default Feed;
