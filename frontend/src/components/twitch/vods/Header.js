import { list2 } from "react-icons-kit/icomoon/list2";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { video } from "react-icons-kit/iconic/video";
import Icon from "react-icons-kit";
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
import AddChannelForm from "./VodSettings";
import styles from "./../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";

export default React.forwardRef((props, ref) => {
  const { refresh, refreshing, vods } = props;

  return (
    <HeaderContainer ref={ref}>
      <HeaderLeftSubcontainer>
        <RefreshButton
          onClick={() => {
            refresh(true);
          }}>
          {refreshing ? (
            <div style={{ height: "25.5px" }}>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Utilities.loadingSpinnerSmall}></Spinner>
            </div>
          ) : (
            <Icon icon={reload} size={22}></Icon>
          )}
        </RefreshButton>
        <Moment fromNow className={styles.vodRefreshTimer} interval={60000}>
          {(vods && vods.loaded) || new Date()}
        </Moment>
        {/* <Moment
            from={(vods && vods.expire) || new Date()}
            ago
            className={styles.vodRefreshTimer}></Moment> */}
      </HeaderLeftSubcontainer>
      <HeaderTitle>
        <Icon icon={video} size={32} style={{ padding: "0 10px", color: "#6f166f" }}></Icon>
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
              <Icon
                icon={list2}
                size={22}
                style={{
                  height: "22px",
                  alignItems: "center",
                  display: "flex",
                }}></Icon>
            </ButtonList>
          </div>
        }
        position='left top'
        className='settingsPopup'>
        <AddChannelForm refresh={refresh} />
      </Popup>
    </HeaderContainer>
  );
});
