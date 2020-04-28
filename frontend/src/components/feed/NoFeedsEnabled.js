import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import Util from "../../util/Util";
import FeedsContext from "./FeedsContext";

export default () => {
  const { enableTwitch, enableYoutube, enableTwitchVods, enableTwitter } = useContext(FeedsContext);
  const [noFeeds, setNoFeeds] = useState(
    !enableTwitch && !enableTwitter && !enableYoutube && !enableTwitchVods
  );
  useEffect(() => {
    let timer;
    if (!enableTwitch && !enableTwitter && !enableYoutube && !enableTwitchVods) {
      timer = setTimeout(() => {
        setNoFeeds(true);
      }, 1000);
    } else {
      clearTimeout(timer);
      setNoFeeds(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [enableTwitch, enableYoutube, enableTwitchVods, enableTwitter]);

  return (
    <CSSTransition
      in={noFeeds}
      timeout={{ appear: 1000, enter: 1000, exit: 0 }}
      classNames='NoFeedsEnabled-Fade'
      unmountOnExit>
      <Alert variant='info' style={Util.feedAlertWarning}>
        <Alert.Heading>No feeds are enabled</Alert.Heading>
        <hr />
        Please enable some feeds in navigation sidebar.
      </Alert>
    </CSSTransition>
  );
};
