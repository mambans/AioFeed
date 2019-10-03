import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";

import RenderTwitch from "./Render-Twitch";
import styles from "./Twitch.module.scss";
import Utilities from "utilities/Utilities";

function Twitch({ data }) {
  const [refreshing, setRefreshing] = useState(null);

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
        // ele.style.backgroundColor = "transparent";
        ele.setAttribute("isVisible", false);
      });
    }
    data.resetNewlyAddedStreams();
  }, [data]);

  const refresh = useCallback(async () => {
    setRefreshing(true);

    await data.refresh();
    setRefreshing(false);
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
        {refreshing ? (
          <Spinner animation='border' role='status' style={Utilities.loadingSpinnerSmall}></Spinner>
        ) : (
          <p key={data.refreshTimer} className={styles.refreshTimer}>
            {Math.trunc(data.refreshTimer) >= 0
              ? `in ${Math.trunc(data.refreshTimer)} seconds`
              : "recently refreshed"}
          </p>
        )}
        <h4 className={styles.container_header}>Twitch</h4>
      </div>
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
    </>
  );
}

export default Twitch;
