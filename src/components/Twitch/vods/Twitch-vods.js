import { Animated } from "react-animated-css";
import { Button, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Moment from "react-moment";
import Popup from "reactjs-popup";
import Icon from "react-icons-kit";
import { reload } from "react-icons-kit/iconic/reload";
import { ic_settings } from "react-icons-kit/md/ic_settings";
import { video } from "react-icons-kit/iconic/video";
import LazyLoad from "react-lazyload";

import ErrorHandeling from "../../error/Error";
import Utilities from "../../../utilities/Utilities";
import styles from "./../Twitch.module.scss";
import RenderTwitchVods from "./Render-Twitch-Vods";
import getFollowedVods from "./GetFollowedVods";
import AddChannelForm from "./VodSettings";

function TwitchVods() {
  const [vods, setVods] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const initialOpen = useRef(true);

  function onChange(newRun) {
    initialOpen.current = newRun;
  }

  const refresh = useCallback(
    async forceRefresh => {
      setRefreshing(true);
      await getFollowedVods(forceRefresh)
        .then(data => {
          setError(data.error);
          setVods(data.data);
          setIsLoaded(true);
          setRefreshing(false);
        })
        .catch(() => {
          setError(error);
        });
    },
    [error]
  );

  const windowFocusHandler = useCallback(async () => {
    refresh(false);
  }, [refresh]);

  const windowBlurHandler = useCallback(() => {}, []);

  useEffect(() => {
    async function fetchData() {
      setRefreshing(true);
      await getFollowedVods()
        .then(data => {
          setError(data.error);
          setVods(data.data);
          setIsLoaded(true);
          setRefreshing(false);
        })
        .catch(() => {
          setError(error);
        });
    }

    fetchData();
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
    };
  }, [error, windowBlurHandler, windowFocusHandler]);

  if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  }
  if (!isLoaded) {
    return (
      <>
        <div className={styles.header_div}>
          <h4 className={styles.container_header}>
            Twitch vods <Icon icon={video} size={32} style={{ paddingLeft: "10px" }}></Icon>
          </h4>
        </div>
        <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      </>
    );
  } else if (!Utilities.getCookie("Twitch-access_token")) {
    return (
      <ErrorHandeling
        data={{
          title: "Couldn't load Twitch-vod feed",
          message: "You are not connected with your Twitch account to Notifies",
        }}></ErrorHandeling>
    );
  } else {
    return (
      <>
        <div className={styles.header_div}>
          <Button
            variant='outline-secondary'
            className={styles.refreshButton}
            onClick={() => {
              refresh(true);
            }}>
            {refreshing ? (
              <div style={{ height: "25.5px" }}>
                <Spinner
                  animation='border'
                  role='status'
                  variant='light'
                  style={Utilities.loadingSpinnerSmall}></Spinner>
              </div>
            ) : (
              <Icon icon={reload} size={22}></Icon>
            )}
          </Button>
          <Moment from={vods.expire} ago className={styles.vodRefreshTimer}></Moment>
          <Popup
            placeholder='Channel name..'
            trigger={
              <Button variant='outline-secondary' className={styles.settings}>
                <Icon
                  icon={ic_settings}
                  size={22}
                  style={{
                    height: "22px",
                    alignItems: "center",
                    display: "flex",
                  }}></Icon>
              </Button>
            }
            position='left center'
            className='settingsPopup'>
            <AddChannelForm></AddChannelForm>
          </Popup>
          <h4 className={styles.container_header}>
            Twitch vods <Icon icon={video} size={32} style={{ paddingLeft: "10px" }}></Icon>
          </h4>
        </div>
        <div className={styles.container}>
          {vods.data.map(vod => {
            return (
              <LazyLoad key={vod.id} height={312} offset={50} once>
                <Animated animationIn='fadeIn' animationOut='fadeOut' isVisible={true}>
                  <RenderTwitchVods
                    data={vod}
                    run={{ initial: initialOpen.current }}
                    runChange={onChange}
                  />
                </Animated>
              </LazyLoad>
            );
          })}
        </div>
      </>
    );
  }
}

export default TwitchVods;
