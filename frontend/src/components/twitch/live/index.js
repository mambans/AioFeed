import { CSSTransition, TransitionGroup } from "react-transition-group";
import Alert from "react-bootstrap/Alert";
import React, { useEffect, useState, useCallback } from "react";

import Header from "./Header";
import StreamEle from "./StreamElement.js";
import { Container } from "../StyledComponents";
import Sidebar from "./../sidebar";
import Util from "../../../util/Util";

export default ({ data }) => {
  const [show, setShow] = useState(true);

  const windowFocusHandler = useCallback(() => {
    document.title = "Notifies | Feed";
    data.resetNewlyAddedStreams();
  }, [data]);

  const windowBlurHandler = useCallback(() => {
    // document.title = "Notifies | Feed";
    data.resetNewlyAddedStreams();
  }, [data]);

  const refresh = useCallback(async () => {
    await data.refresh();
  }, [data]);

  useEffect(() => {
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("focus", windowFocusHandler);
      window.removeEventListener("blur", windowBlurHandler);
    };
  }, [windowBlurHandler, windowFocusHandler]);

  return (
    <>
      <Header data={data} refresh={refresh} />

      {data.error ? (
        show && (
          <Alert
            variant='secondary'
            style={{
              ...Util.feedAlertWarning,
              width: "var(--feedsWidth)",
              margin: "var(--feedsMargin)",
            }}
            dismissible
            onClose={() => setShow(false)}>
            <Alert.Heading>{data.error}</Alert.Heading>
          </Alert>
        )
      ) : (
        <>
          <Sidebar
            onlineStreams={data.liveStreams}
            newlyAdded={data.newlyAddedStreams}
            REFRESH_RATE={data.REFRESH_RATE}
          />
          {data.liveStreams.length > 0 ? (
            <Container>
              <TransitionGroup className='twitch-live' component={null}>
                {data.liveStreams.map(stream => {
                  return (
                    <CSSTransition
                      // in={true}
                      key={stream.id}
                      timeout={1000}
                      classNames='videoFade-1s'
                      unmountOnExit>
                      <StreamEle
                        key={stream.id}
                        data={stream}
                        newlyAddedStreams={data.newlyAddedStreams}
                        newlyAdded={stream.newlyAdded}
                        refresh={refresh}
                        REFRESH_RATE={data.REFRESH_RATE}
                      />
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </Container>
          ) : (
            show && (
              <Alert
                variant='secondary'
                style={{
                  ...Util.feedAlertWarning,
                  width: "var(--feedsWidth)",
                  margin: "var(--feedsMargin)",
                }}
                dismissible
                onClose={() => setShow(false)}>
                <Alert.Heading>No streams online at the momment</Alert.Heading>
              </Alert>
            )
          )}
        </>
      )}
    </>
  );
};
