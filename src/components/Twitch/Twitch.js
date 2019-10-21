import { Animated } from "react-animated-css";
import React, { useEffect, useState, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import Countdown from "react-countdown-now";

import { Button, Spinner } from "react-bootstrap";
// import ReactCSSTransitionGroup from "react-addons-css-transition-group"; // ES6
// import LazyLoad from "react-lazyload";

import RenderTwitch from "./Render-Twitch";
import styles from "./Twitch.module.scss";
import Utilities from "../../utilities/Utilities";

import Icon from "react-icons-kit";
import { reload } from "react-icons-kit/iconic/reload";

// import { feed } from "react-icons-kit/icomoon/feed";
import { twitch } from "react-icons-kit/fa/twitch";

import "./Twitch.scss";

function Twitch({ data }) {
  const [show, setShow] = useState(true);

  const windowFocusHandler = useCallback(() => {
    document.title = "Notifies | Feed";
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
          {data.refreshing ? (
            <div style={{ height: "25.5px" }}>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Utilities.loadingSpinnerSmall}></Spinner>
            </div>
          ) : (
            <>
              <Icon icon={reload} size={22}></Icon>
            </>
          )}
        </Button>
        <p key={data.refreshTimer} className={styles.refreshTimer}>
          <Countdown date={data.refreshTimer} zeroPadDays={0} zeroPadTime={2} />
        </p>
        <h4 className={styles.container_header}>
          Twitch Live <Icon icon={twitch} size={32} style={{ paddingLeft: "10px" }}></Icon>
        </h4>
      </div>
      {data.error ? (
        show ? (
          <Alert
            variant='secondary'
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
              <Animated
                animationIn='fadeIn'
                animationOut='fadeOut'
                isVisible={true}
                key={stream.id}>
                <RenderTwitch
                  data={stream}
                  run={{ initial: data.initialOpen }}
                  runChange={data.onChange}
                  newlyAdded={stream.newlyAdded}
                  newlyAddedStreams={data.newlyAddedStreams}
                  key={stream.id}
                  refresh={refresh}
                />
              </Animated>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Twitch;
