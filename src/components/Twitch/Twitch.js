import React, { useEffect, useState, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import Countdown from "react-countdown-now";

import { Button, Spinner } from "react-bootstrap";
// import LazyLoad from "react-lazyload";

import RenderTwitch from "./Render-Twitch";
import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";

import "./Twitch.scss";

function Twitch({ data }) {
  const [show, setShow] = useState(true);

  const windowFocusHandler = useCallback(() => {
    document.title = "Notifies | Feed";
    // document.getElementById(
    //   "favicon16"
    // ).href = `${process.env.PUBLIC_URL}/icons/favicon2-16x16.png`;
    // document.getElementById(
    //   "favicon32"
    // ).href = `${process.env.PUBLIC_URL}/icons/favicon2-32x32.png`;
    data.refresh();
  }, [data]);

  const windowBlurHandler = useCallback(() => {
    const highlight = document.querySelectorAll(".highlight");
    if (highlight) {
      highlight.forEach(ele => {
        ele.setAttribute("isVisible", false);
      });
    }
    data.resetNewlyAddedStreams();
  }, [data]);

  const refresh = useCallback(async () => {
    await data.refresh();
  }, [data]);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [windowBlurHandler, windowFocusHandler]);

  return (
    <>
      <div
        className={styles.header_div}
        style={{
          marginTop: "0",
        }}>
        <Button variant='outline-secondary' className={styles.refreshButton} onClick={refresh}>
          Reload
        </Button>
        {data.refreshing ? (
          <Spinner animation='border' role='status' style={Utilities.loadingSpinnerSmall}></Spinner>
        ) : (
          <p key={data.refreshTimer} className={styles.refreshTimer}>
            <Countdown date={data.refreshTimer} zeroPadDays={0} zeroPadTime={0} />
          </p>
        )}
        <h4 className={styles.container_header}>Twitch</h4>
      </div>
      {data.error ? (
        show ? (
          <Alert
            variant='info'
            style={Utilities.feedAlertWarning}
            dismissible
            onClose={() => setShow(false)}>
            <Alert.Heading>{data.error}</Alert.Heading>
          </Alert>
        ) : null
      ) : (
        <div className={styles.container}>
          {data.liveStreams.map(stream => {
            return (
              <RenderTwitch
                data={stream}
                run={{ initial: data.initialOpen }}
                runChange={data.onChange}
                newlyAdded={stream.newlyAdded}
                newlyAddedStreams={data.newlyAddedStreams}
                key={stream.id}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default Twitch;
