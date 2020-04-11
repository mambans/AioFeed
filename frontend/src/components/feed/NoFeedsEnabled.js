import React, { useContext } from "react";
import { Alert } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import Util from "../../util/Util";
import FeedsContext from "./FeedsContext";

export default () => {
  const {
    enableTwitch,
    enableYoutube,
    enableTwitchVods,
    enableTwitter,
    twitterListName,
  } = useContext(FeedsContext);
  if (
    !enableTwitch &&
    (!enableTwitter || !twitterListName) &&
    !enableYoutube &&
    !enableTwitchVods
  ) {
    return (
      <CSSTransition in={true} timeout={750} classNames='fade-750ms' unmountOnExit>
        <Alert variant='info' style={Util.feedAlertWarning}>
          <Alert.Heading>No feeds are enabled</Alert.Heading>
          <hr />
          Please enable some feeds in navigation sidebar.
        </Alert>
      </CSSTransition>
    );
  } else {
    return null;
  }
};
