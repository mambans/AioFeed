import { CSSTransition, TransitionGroup } from "react-transition-group";
import Alert from "react-bootstrap/Alert";
import React, { useState } from "react";

import StreamEle from "./StreamElement.js";
import { Container } from "../StyledComponents";
import Util from "../../../util/Util";
import LoadingBoxes from "../LoadingBoxes";

export default ({ data }, centerContainerRef) => {
  const [show, setShow] = useState(true);

  return (
    <>
      {data.loaded ? (
        <>
          {data.error ? (
            show && (
              <Alert
                variant='secondary'
                style={{
                  ...Util.feedAlertWarning,
                  width: "50%",
                  margin: "auto",
                }}
                dismissible
                onClose={() => setShow(false)}>
                <Alert.Heading>{data.error}</Alert.Heading>
              </Alert>
            )
          ) : (
            <Container>
              <TransitionGroup component={null}>
                {data.liveStreams.map((stream) => {
                  return (
                    <CSSTransition
                      key={stream.id}
                      timeout={750}
                      classNames='videoFadeSlide'
                      unmountOnExit
                      appear>
                      <StreamEle
                        key={stream.id}
                        data={stream}
                        newlyAddedStreams={data.newlyAddedStreams}
                        newlyAdded={stream.newlyAdded}
                        refresh={async () => {
                          await data.refresh();
                        }}
                        REFRESH_RATE={data.REFRESH_RATE}
                        refreshAfterUnfollowTimer={data.refreshAfterUnfollowTimer}
                      />
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>

              {data.liveStreams.length <= 0 && show && (
                <Alert
                  variant='secondary'
                  style={{
                    ...Util.feedAlertWarning,
                    width: "50%",
                    margin: "auto",
                  }}
                  dismissible
                  onClose={() => setShow(false)}>
                  <Alert.Heading>No streams online at the momment</Alert.Heading>
                </Alert>
              )}
            </Container>
          )}
        </>
      ) : (
        <Container>
          <LoadingBoxes
            amount={
              centerContainerRef && centerContainerRef.clientWidth
                ? Math.floor((centerContainerRef.clientWidth / 350) * 0.8)
                : 4
            }
          />
        </Container>
      )}
    </>
  );
};
