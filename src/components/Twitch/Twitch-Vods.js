import { Button, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Moment from "react-moment";

import ErrorHandeling from "../error/Error";
import Utilities from "utilities/Utilities";
import styles from "./Twitch.module.scss";
import RenderTwitchVods from "./Render-Twitch-Vods";

import getFollowedChannels from "./GetFollowedChannels";
import getFollowedVods from "./GetFollowedVods";

import AddChannelForm from "./VodSettings";

import Popup from "reactjs-popup";

function TwitchVods() {
  const [vods, setVods] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const followedChannels = useRef();

  const refresh = useCallback(() => {
    console.log("Refreshing vods");
    async function fetchData() {
      try {
        const followedVods = await getFollowedVods(followedChannels.current, true);

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
      console.log("Vods windowFocusHandler");

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

  const windowBlurHandler = useCallback(() => {
    console.log("Focus lost");
  }, []);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);
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
        <Button variant="outline-secondary" className={styles.refreshButton} onClick={refresh}>
          Reload
        </Button>
        <Moment from={vods.expire} ago className={styles.vodRefreshTimer}></Moment>
        <Popup
          placeholder="Channel name.."
          trigger={
            <Button
              variant="outline-secondary"
              className={styles.settings}
              // onClick={addChannelForm}
            >
              Settings
            </Button>
          }
          position="left center"
          className="settingsPopup">
          <AddChannelForm></AddChannelForm>
        </Popup>
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
