import { Animated } from "react-animated-css";
import { Spinner } from "react-bootstrap";
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
import {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  SubFeedContainer,
  ButtonList,
} from "./../../sharedStyledComponents";

function TwitchVods() {
  const [vods, setVods] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const initialOpen = useRef(true);

  function onChange(newRun) {
    initialOpen.current = newRun;
  }

  const refresh = useCallback(async forceRefresh => {
    setRefreshing(true);
    await getFollowedVods(forceRefresh)
      .then(data => {
        setError(data.error);
        setVods(data.data);
        setIsLoaded(true);
        setRefreshing(false);
      })
      .catch(data => {
        setError(data.error);
        setVods(data.data);
      });
  }, []);

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

  if (Utilities.getCookie("Twitch-access_token") === null) {
    return (
      <ErrorHandeling
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for twitch available.",
        }}></ErrorHandeling>
    );
  } else if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  }
  if (!isLoaded) {
    return (
      <>
        <HeaderContainer>
          <HeaderTitle style={{ margin: "0" }}>
            Twitch vods <Icon icon={video} size={32} style={{ paddingLeft: "10px" }}></Icon>
          </HeaderTitle>
        </HeaderContainer>
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
        <HeaderContainer>
          <div
            style={{
              width: "300px",
              minWidth: "300px",
              alignItems: "end",
              display: "flex",
            }}>
            <RefreshButton
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
            </RefreshButton>
            <Moment from={vods.expire} ago className={styles.vodRefreshTimer}></Moment>
          </div>
          <HeaderTitle>
            Twitch vods <Icon icon={video} size={32} style={{ paddingLeft: "10px" }}></Icon>
          </HeaderTitle>
          <Popup
            placeholder='Channel name..'
            arrow={false}
            trigger={
              <ButtonList variant='outline-secondary' className={styles.settings}>
                <Icon
                  icon={ic_settings}
                  size={22}
                  style={{
                    height: "22px",
                    alignItems: "center",
                    display: "flex",
                  }}></Icon>
              </ButtonList>
            }
            position='left top'
            className='settingsPopup'>
            <AddChannelForm></AddChannelForm>
          </Popup>
        </HeaderContainer>
        <SubFeedContainer>
          {vods.data.map(vod => {
            return (
              <LazyLoad key={vod.id} height={312} offset={25} once>
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
        </SubFeedContainer>
      </>
    );
  }
}

export default TwitchVods;
