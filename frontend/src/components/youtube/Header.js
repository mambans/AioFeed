import { MdRefresh } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { FaYoutube } from "react-icons/fa";
import Alert from "react-bootstrap/Alert";
import Moment from "react-moment";
import React from "react";

import styles from "./Youtube.module.scss";
import Util from "../../util/Util";
import { RefreshButton, HeaderTitle, HeaderContainer } from "./../sharedStyledComponents";
import { HeaderLeftSubcontainer } from "./../twitch/StyledComponents";
import ReAuthenticateButton from "../navigation/sidebar/ReAuthenticateButton";
import ChannelList from "./channelList";

const SubFeedError = (props) => {
  const { error } = props;
  let alertError;
  let alertVariant;

  if (error && error.code) {
    switch (error.code) {
      case 401:
        alertError =
          error.errors[0].reason + " - Authendication expired and only cache used instead.";
        alertVariant = "danger";
        break;
      case 403:
        alertError = error.errors[0].reason + " - Only cache used instead.";
        alertVariant = "warning";
        break;
      default:
        alertError = error.errors[0].reason;
        alertVariant = "warning";
        break;
    }

    return (
      <>
        <Alert
          key={error.errors[0].reason}
          className={styles.requestError}
          variant={alertVariant || "warning"}>
          {alertError}
          {error.code === 401 && (
            <ReAuthenticateButton
              serviceName={"Youtube"}
              style={{ marginLeft: "15px", display: "inline-block" }}
            />
          )}
        </Alert>
      </>
    );
  } else {
    return "";
  }
};

export default (data) => {
  const { refresh, requestError, followedChannels, videos, isLoaded, setVideos } = data;
  return (
    <HeaderContainer id='YoutubeHeader'>
      <HeaderLeftSubcontainer>
        <RefreshButton disabled={!isLoaded} onClick={refresh}>
          {!isLoaded ? (
            <div className='SpinnerWrapper'>
              <Spinner animation='border' role='status' style={Util.loadingSpinnerSmall}></Spinner>
            </div>
          ) : (
            <MdRefresh size={34} />
          )}
        </RefreshButton>

        <Moment key={isLoaded || Date.now()} className={styles.lastRefresh} fromNow>
          {isLoaded || Date.now()}
        </Moment>
      </HeaderLeftSubcontainer>
      <SubFeedError error={requestError}></SubFeedError>
      <HeaderTitle>
        <FaYoutube size={32} style={{ color: "#a80000" }} />
        Youtube
      </HeaderTitle>
      <ChannelList followedChannels={followedChannels} videos={videos} setVideos={setVideos} />
    </HeaderContainer>
  );
};
