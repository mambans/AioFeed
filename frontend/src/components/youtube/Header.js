import { list2 } from "react-icons-kit/icomoon/list2";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { youtube } from "react-icons-kit/icomoon/youtube";
import Alert from "react-bootstrap/Alert";
import Icon from "react-icons-kit";
import Moment from "react-moment";
import Popup from "reactjs-popup";
import React from "react";
import { CSSTransition } from "react-transition-group";

import styles from "./Youtube.module.scss";
import Utilities from "../../utilities/Utilities";
import {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  ButtonList,
} from "./../sharedStyledComponents";
import RenderFollowedChannelList from "./channelList/RenderFollowedChannelList";

const SubFeedError = props => {
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
      <Alert
        key={error.errors[0].reason}
        className={styles.requestError}
        variant={alertVariant || "warning"}>
        {alertError}
      </Alert>
    );
  } else {
    return "";
  }
};

export default data => {
  return (
    <CSSTransition in={true} timeout={1000} classNames='fade-1s' unmountOnExit>
      <HeaderContainer>
        <div
          style={{
            width: "300px",
            minWidth: "300px",
            alignItems: "end",
            display: "flex",
          }}>
          <RefreshButton
            onClick={data.refresh}
            // disabled={data.requestError && data.requestError.code === 403 ? true : false}
          >
            {!data.isLoaded ? (
              <div style={{ height: "25.5px" }}>
                <Spinner
                  animation='border'
                  role='status'
                  style={Utilities.loadingSpinnerSmall}></Spinner>
              </div>
            ) : (
              <Icon icon={reload} size={22}></Icon>
            )}
          </RefreshButton>

          <Moment key={data.isLoaded || new Date()} className={styles.lastRefresh} fromNow>
            {data.isLoaded || new Date()}
          </Moment>
        </div>
        <SubFeedError error={data.requestError}></SubFeedError>
        <HeaderTitle style={{ marginRight: "300px " }}>
          Youtube
          <Icon icon={youtube} size={32} style={{ paddingLeft: "10px", color: "#a80000" }}></Icon>
        </HeaderTitle>
        <Popup
          placeholder='""'
          arrow={false}
          trigger={
            <ButtonList>
              <Icon
                icon={list2}
                size={22}
                style={{
                  height: "22px",
                  alignItems: "center",
                  display: "flex",
                }}></Icon>
            </ButtonList>
          }
          position='left top'
          className='popupModal'>
          <RenderFollowedChannelList followedChannels={data.followedChannels} />
        </Popup>
      </HeaderContainer>
    </CSSTransition>
  );
};
