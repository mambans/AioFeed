import React from "react";
import Moment from "react-moment";

// import NotificationsContext from "./NotificationsContext";
import { Notification } from "./styledComponent";
import Utilities from "../../utilities/Utilities";
import "./Notifications.scss";

export default props => {
  return (
    <div>
      <ul>
        <li
          onClick={() => {
            props.clearNotifications();
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
          }}>
          Clear all ({props.notifications ? props.notifications.length : 0})
        </li>
        {props.notifications
          ? props.notifications.map(item => {
              return (
                <Notification key={item.key}>
                  <a
                    className='profileImg'
                    href={"https://www.twitch.tv/" + item.user_name.toLowerCase()}
                    alt=''>
                    <img src={item.profile_img_url} alt=''></img>
                  </a>
                  <a
                    href={"https://www.twitch.tv/" + item.user_name.toLowerCase()}
                    alt=''
                    className='name'>
                    <b>{item.user_name}</b> went {item.status}
                  </a>
                  <a
                    href={"https://www.twitch.tv/" + item.user_name.toLowerCase() + "/videos"}
                    className='title'>
                    {Utilities.truncate(item.title, 50)}
                  </a>
                  <Moment fromNow className='date'>
                    {item.date}
                  </Moment>
                </Notification>
              );
            })
          : null}
      </ul>
    </div>
  );
};
