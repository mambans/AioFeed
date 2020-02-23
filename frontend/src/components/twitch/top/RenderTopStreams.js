import { CSSTransition, TransitionGroup } from "react-transition-group";
import { MdFormatListBulleted } from "react-icons/md";
// import { MdRefresh } from "react-icons/md";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { FaTwitch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Icon from "react-icons-kit";
import Popup from "reactjs-popup";
import React, { useEffect, useState, useCallback, useRef } from "react";

import { RefreshButton, HeaderTitle, ButtonList } from "./../../sharedStyledComponents";
import { StyledLoadmore } from "./../styledComponents";
import GameSearchBar from "./GameSearchBar";
import GetTopStreams from "./GetTopStreams";
import LoadingBoxs from "./../LoadingBoxs";
import RenderTopGamesList from "./RenderTopGamesList";
import StreamEle from "./StreamElement";
import styles from "./../Twitch.module.scss";
import Utilities from "./../../../utilities/Utilities";

export default () => {
  const { category } = useParams();
  document.title = `Notifies | ${category || "All"} Top`;

  const [topStreams, setTopStreams] = useState();
  const [loadmoreLoaded, setLoadmoreLoaded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const oldTopStreams = useRef();
  const loadmoreRef = useRef();

  const loadMore = useCallback(() => {
    setLoadmoreLoaded(false);
    GetTopStreams(category, oldTopStreams.current.pagination.cursor).then(res => {
      const allTopStreams = oldTopStreams.current.data.concat(res.topStreams.data.data);
      oldTopStreams.current = {
        data: allTopStreams,
        pagination: res.topStreams.data.pagination,
      };

      setLoadmoreLoaded(true);
      setTopStreams(allTopStreams);

      setTimeout(() => {
        if (loadmoreRef.current) {
          loadmoreRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      }, 0);
    });
  }, [category]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    GetTopStreams(category).then(res => {
      oldTopStreams.current = res.topStreams.data;
      setTopStreams(res.topStreams.data.data);
      setRefreshing(false);
    });
  }, [category]);

  useEffect(() => {
    setRefreshing(true);
    GetTopStreams(category)
      .then(res => {
        oldTopStreams.current = res.topStreams.data;
        setTopStreams(res.topStreams.data.data);
        setRefreshing(false);
      })
      .catch(e => {
        if ((e.message = "game is undefined")) {
          setError("Invalid game name");
        } else {
          setError(e.message);
        }
        setRefreshing(false);
      });
  }, [category]);

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
              <div style={{ height: "24px" }}>
                <Spinner
                  animation='border'
                  role='status'
                  variant='light'
                  style={Utilities.loadingSpinnerSmall}></Spinner>
              </div>
            ) : (
              <Icon icon={reload} size={22}></Icon>
              // <MdRefresh size={24} />
            )}
          </RefreshButton>
        </div>
        <HeaderTitle style={{ marginLeft: "10px" }}>
          <FaTwitch size={32} style={{ color: "#6f166f" }} />
          Top Streams
        </HeaderTitle>
        <div style={{ display: "flex" }}>
          <GameSearchBar gameName={category} />
          <Popup
            placeholder='""'
            arrow={false}
            trigger={
              <ButtonList style={{ width: "300px", justifyContent: "left" }}>
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "250px",
                    margin: 0,
                  }}>
                  {category !== "" && category !== undefined ? category : "All"}
                </p>
                <MdFormatListBulleted
                  size={22}
                  style={{
                    height: "22px",
                    alignItems: "center",
                    display: "flex",
                    marginLeft: "15px",
                    right: "7px",
                    position: "absolute",
                  }}
                />
              </ButtonList>
            }
            position='bottom center'
            className='popupModal'>
            <RenderTopGamesList />
          </Popup>
        </div>
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
          {topStreams ? (
            <>
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
              <StyledLoadmore ref={loadmoreRef}>
                <div />
                <p
                  onClick={() => {
                    loadMore();
                  }}>
                  {!loadmoreLoaded ? (
                    <>
                      Loading..
                      <Spinner
                        animation='border'
                        role='status'
                        variant='light'
                        style={{ ...Utilities.loadingSpinnerSmall, marginLeft: "10px" }}
                      />
                    </>
                  ) : (
                    "Load more"
                  )}
                </p>
                <div />
              </StyledLoadmore>
            </>
          ) : (
            <LoadingBoxs
              amount={Math.floor(((document.documentElement.clientWidth - 150) / 350) * 1.5)}
            />
          )}
        </div>
      )}
    </>
  );
};
