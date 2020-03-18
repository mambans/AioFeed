import { MdFormatListBulleted } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { MdVideocam } from "react-icons/md";
import Alert from "react-bootstrap/Alert";
import Moment from "react-moment";
import Popup from "reactjs-popup";
import React from "react";

import { HeaderLeftSubcontainer } from "./../styledComponents";
import {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  ButtonList,
} from "./../../sharedStyledComponents";
import styles from "./../Twitch.module.scss";
import Util from "../../../util/Util";
import VodChannelList from "./VodChannelList";

export default React.forwardRef((props, ref) => {
  const { refresh, refreshing, vods, vodError } = props;

  return (
    <HeaderContainer ref={ref}>
      <HeaderLeftSubcontainer>
        <RefreshButton
          onClick={() => {
            refresh(true);
          }}>
          {refreshing ? (
            <div className='SpinnerWrapper'>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Util.loadingSpinnerSmall}></Spinner>
            </div>
          ) : (
            <MdRefresh size={34} />
          )}
        </RefreshButton>
        <Moment fromNow className={styles.vodRefreshTimer} interval={60000}>
          {(vods && vods.loaded) || new Date()}
        </Moment>
        {vodError ? (
          <Alert
            key={vodError}
            style={{
              padding: "5px",
              opacity: "0.8",
              margin: "0",
              position: "absolute",
              marginLeft: "250px",
              //color: #ffc51c,
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid",
              borderRadius: "0",
              fontWeight: "bold",
              filter: "brightness(250%)",
            }}
            variant={"warning"}>
            {vodError}
          </Alert>
        ) : null}
      </HeaderLeftSubcontainer>
      <HeaderTitle>
        <MdVideocam size={32} style={{ color: "#6f166f" }} />
        Twitch vods
      </HeaderTitle>
      <Popup
        placeholder='Channel name..'
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
            <ButtonList variant='outline-secondary' className={styles.settings}>
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
        className='settingsPopup'>
        <VodChannelList />
      </Popup>
    </HeaderContainer>
  );
});
