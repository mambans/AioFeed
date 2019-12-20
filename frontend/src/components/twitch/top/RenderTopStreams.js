import { list2 } from "react-icons-kit/icomoon/list2";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { twitch } from "react-icons-kit/fa/twitch";
import Icon from "react-icons-kit";
import Popup from "reactjs-popup";
import React, { useEffect, useState, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { RefreshButton, HeaderTitle, ButtonList } from "./../../sharedStyledComponents";
import GetTopStreams from "./GetTopStreams";
import RenderTopGamesList from "./RenderTopGamesList";
import StreamEle from "./StreamElement";
import styles from "./../Twitch.module.scss";
import Utilities from "./../../../utilities/Utilities";
import GameSearchBar from "./GameSearchBar";

const RenderTopStreams = () => {
  const game_param_url = decodeURI(new URL(window.location.href).pathname.split("/")[3]);

  const [topStreams, setTopStreams] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setRefreshing(true);
    // setIsLoaded(false);
    GetTopStreams(game_param_url).then(res => {
      setTopStreams(res.topStreams.data.data);
      setRefreshing(false);
      setIsLoaded(true);
    });
  }, [game_param_url]);

  useEffect(() => {
    setRefreshing(true);
    setIsLoaded(false);
    setError(null);
    GetTopStreams(game_param_url)
      .then(res => {
        setTopStreams(res.topStreams.data.data);
        setRefreshing(false);
        setIsLoaded(true);
      })
      .catch(e => {
        if ((e.message = "game is undefined")) {
          setError("Invalid game name");
        } else {
          setError(e.message);
        }
        setRefreshing(false);
        setIsLoaded(true);
      });
  }, [game_param_url]);

  return (
    <>
      <div className={styles.headerContainerTopStreams}>
        <div
          style={{
            width: "575px",
            minWidth: "575px",
            alignItems: "end",
            display: "flex",
          }}>
          <RefreshButton onClick={refresh}>
            {refreshing ? (
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
          </RefreshButton>
        </div>
        <HeaderTitle style={{ width: "200px", marginRight: "auto" }}>
          Top Streams <Icon icon={twitch} size={32} style={{ paddingLeft: "10px" }}></Icon>
        </HeaderTitle>
        <GameSearchBar gameName={game_param_url} />
        <Popup
          placeholder='""'
          arrow={false}
          trigger={
            <ButtonList style={{ width: "300px", justifyContent: "center" }}>
              {game_param_url !== "" && game_param_url !== "" ? game_param_url : "All"}
              <Icon
                icon={list2}
                size={22}
                style={{
                  height: "22px",
                  alignItems: "center",
                  display: "flex",
                  paddingLeft: "15px",
                  right: "7px",
                  position: "absolute",
                }}></Icon>
            </ButtonList>
          }
          position='bottom center'
          className='popupModal'>
          <RenderTopGamesList />
        </Popup>
      </div>
      {error ? (
        <Alert
          variant='warning'
          style={{ textAlign: "center", width: "25%", margin: "auto" }}
          dismissible
          onClose={() => setError(null)}>
          <Alert.Heading>{error}</Alert.Heading>
        </Alert>
      ) : (
        <div className={styles.topStreamsContainer}>
          {isLoaded ? (
            <TransitionGroup className='twitch-top-live' component={null}>
              {topStreams.map(stream => {
                return (
                  <CSSTransition
                    // in={true}
                    key={stream.id}
                    timeout={1000}
                    classNames='fade-1s'
                    unmountOnExit>
                    <StreamEle data={stream} />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          ) : (
            <Spinner
              animation='grow'
              role='status'
              style={Utilities.loadingSpinner}
              variant='light'>
              <span className='sr-only'>Loading...</span>
            </Spinner>
          )}
        </div>
      )}
    </>
  );
};

export default RenderTopStreams;
