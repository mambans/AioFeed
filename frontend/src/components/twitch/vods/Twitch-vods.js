import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ic_settings } from "react-icons-kit/md/ic_settings";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { video } from "react-icons-kit/iconic/video";
import Icon from "react-icons-kit";
import LazyLoad from "react-lazyload";
import Moment from "react-moment";
import Popup from "reactjs-popup";
import React, { useState, useEffect, useRef, useCallback } from "react";

import AddChannelForm from "./VodSettings";
import ErrorHandeling from "../../error/Error";
import getFollowedVods from "./GetFollowedVods";
import RenderTwitchVods from "./Render-Twitch-Vods";
import styles from "./../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";
import {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  SubFeedContainer,
  ButtonList,
} from "./../../sharedStyledComponents";

const HeaderContainerFade = props => {
  const { refresh, refreshing, vods } = props;
  return (
    <CSSTransition in={true} timeout={0} classNames='fade-1s' unmountOnExit>
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
          <Moment
            from={(vods && vods.expire) || new Date()}
            ago
            className={styles.vodRefreshTimer}></Moment>
        </div>
        <HeaderTitle>
          Twitch vods
          <Icon icon={video} size={32} style={{ paddingLeft: "10px", color: "#6f166f" }}></Icon>
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
    </CSSTransition>
  );
};

function TwitchVods() {
  const [vods, setVods] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const initialOpen = useRef(true);
  const transition = useRef("fade-1s");

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
        <HeaderContainerFade refresh={refresh} refreshing={refreshing} vods={vods} />
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
        <HeaderContainerFade refresh={refresh} refreshing={refreshing} vods={vods} />
        <SubFeedContainer>
          <TransitionGroup className='twitch-vods' component={null}>
            {vods.data.map(vod => {
              return (
                <LazyLoad key={vod.id} height={312} offset={25} once>
                  <CSSTransition
                    in={vod ? true : false}
                    key={vod.id}
                    timeout={1000}
                    classNames={transition.current}
                    // classNames='videoFade-1s'
                    unmountOnExit>
                    <RenderTwitchVods
                      data={vod}
                      run={{ initial: initialOpen.current }}
                      runChange={onChange}
                    />
                  </CSSTransition>
                </LazyLoad>
              );
            })}
            {(transition.current = "videoFade-1s")}
          </TransitionGroup>
        </SubFeedContainer>
      </>
    );
  }
}

export default TwitchVods;
