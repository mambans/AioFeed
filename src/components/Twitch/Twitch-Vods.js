import { Button, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Moment from "react-moment";
import Popup from "reactjs-popup";

import ErrorHandeling from "../error/Error";
import Utilities from "utilities/Utilities";
import styles from "./Twitch.module.scss";
import RenderTwitchVods from "./Render-Twitch-Vods";
import getFollowedChannels from "./GetFollowedChannels";
import getFollowedVods from "./GetFollowedVods";
import AddChannelForm from "./VodSettings";

function TwitchVods() {
  const [vods, setVods] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const followedChannels = useRef();

  const refresh = useCallback(() => {
    async function fetchData() {
      try {
        const followedVodsResponse = await getFollowedVods(followedChannels.current, true);

        const followedVods = followedVodsResponse.data;

        setError(followedVodsResponse.error);

        setVods(followedVods);
        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, []);

  const windowFocusHandler = useCallback(() => {
    async function fetchData() {
      try {
        followedChannels.current = await getFollowedChannels();
        const followedVodsResponse = await getFollowedVods(followedChannels.current);

        const followedVods = followedVodsResponse.data;

        setError(followedVodsResponse.error);

        setVods(followedVods);
        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);

  const windowBlurHandler = useCallback(() => {}, []);

  useEffect(() => {
    async function fetchData() {
      try {
        followedChannels.current = await getFollowedChannels();

        const followedVodsResponse = await getFollowedVods(followedChannels.current);

        const followedVods = followedVodsResponse.data;

        setError(followedVodsResponse.error);

        setVods(followedVods);
        setIsLoaded(true);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [windowBlurHandler, windowFocusHandler]);

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
        <div className={styles.header_div}>
          <Button variant="outline-secondary" className={styles.refreshButton} onClick={refresh}>
            Reload
          </Button>
          <Moment from={vods.expire} ago className={styles.vodRefreshTimer}></Moment>
          <Popup
            placeholder="Channel name.."
            trigger={
              <Button variant="outline-secondary" className={styles.settings}>
                Settings
              </Button>
            }
            position="left center"
            className="settingsPopup">
            <AddChannelForm></AddChannelForm>
          </Popup>
          <h4 className={styles.container_header}>Twitch vods</h4>
        </div>
        <div className={styles.container}>
          {vods.data.map(vod => {
            return <RenderTwitchVods data={vod} key={vod.id} />;
          })}
        </div>
      </>
    );
  }
}

export default TwitchVods;
