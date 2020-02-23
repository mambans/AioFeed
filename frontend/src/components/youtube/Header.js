import { MdFormatListBulleted } from "react-icons/md";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { FaYoutube } from "react-icons/fa";
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
import { HeaderLeftSubcontainer } from "./../twitch/styledComponents";

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
        <HeaderLeftSubcontainer>
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
        </HeaderLeftSubcontainer>
        <SubFeedError error={data.requestError}></SubFeedError>
        <HeaderTitle>
          <FaYoutube size={32} style={{ color: "#a80000" }} />
          Youtube
        </HeaderTitle>
        <Popup
          placeholder='""'
          arrow={false}
          trigger={
            <div
              style={{
                width: "50px",
                minWidth: "50px",
                marginLeft: "250px",
                justifyContent: "right",
                display: "flex",
              }}>
              <ButtonList>
                <MdFormatListBulleted
                  size={22}
                  style={{
                    height: "22px",
                    alignItems: "center",
                    display: "flex",
                  }}
                />
              </ButtonList>
            </div>
          }
          position='left top'
          className='popupModal'>
          <RenderFollowedChannelList followedChannels={data.followedChannels} />
        </Popup>
      </HeaderContainer>
    </CSSTransition>
  );
};
