import React, { useEffect, useState, useCallback } from "react";
import { Animated } from "react-animated-css";
import { Spinner } from "react-bootstrap";
import Icon from "react-icons-kit";
import Popup from "reactjs-popup";
import { list2 } from "react-icons-kit/icomoon/list2";
import { twitch } from "react-icons-kit/fa/twitch";
import { reload } from "react-icons-kit/iconic/reload";

import GetTopStreams from "./GetTopStreams";
import StreamEle from "./StreamElement";
import Utilities from "./../../../utilities/Utilities";
import styles from "./../Twitch.module.scss";
import RenderTopGamesList from "./RenderTopGamesList";

import {} from "./../styledComponents";
import { RefreshButton, HeaderTitle, ButtonList } from "./../../sharedStyledComponents";

const RenderTopStreams = () => {
  const [topStreams, setTopStreams] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [game, setGame] = useState({ name: "All" });

  const refresh = useCallback(() => {
    setIsLoaded(false);
    GetTopStreams(game).then(res => {
      setTopStreams(res.data.data);
      setIsLoaded(true);
    });
  }, [game]);

  useEffect(() => {
    GetTopStreams().then(res => {
      setTopStreams(res.data.data);
      setIsLoaded(true);
    });
  }, []);

  return (
    <>
      <div className={styles.headerContainerTopStreams}>
        <div
          style={{
            width: "300px",
            minWidth: "300px",
            alignItems: "end",
            display: "flex",
          }}>
          <RefreshButton onClick={refresh}>
            {!isLoaded ? (
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
        <Popup
          placeholder='""'
          arrow={false}
          trigger={
            <ButtonList style={{ width: "300px", justifyContent: "center" }}>
              {game.name || "All"}
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
          <RenderTopGamesList
            setTopStreams={setTopStreams}
            setIsLoaded={setIsLoaded}
            setGame={setGame}></RenderTopGamesList>
        </Popup>
      </div>
      <div className={styles.topStreamsContainer}>
        {isLoaded ? (
          topStreams.map(stream => {
            return (
              <Animated
                animationIn='fadeIn'
                animationOut='fadeOut'
                animationInDuration={500}
                key={stream.id}>
                <StreamEle data={stream} key={stream.id}></StreamEle>
              </Animated>
            );
          })
        ) : (
          <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
            <span className='sr-only'>Loading...</span>
          </Spinner>
        )}
      </div>
    </>
  );
};

export default RenderTopStreams;
