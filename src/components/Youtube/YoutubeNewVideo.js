import React from "react";
// import axios from "axios";

function YoutubeNewVideo() {
  console.log("YoutubeNewVideo");
  // let res;
  // async function sub() {
  //   res = await axios
  //     .post(`https://pubsubhubbub.appspot.com/subscribe`, {
  //       data: {
  //         "hub.callback": "http://79.136.57.214:3000/youtube/notifications",
  //         "hub.mode": "subscribe",
  //         "hub.topic":
  //           "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCHiof82PvgZrXFF-BRMvGDg",
  //         "hub.lease_seconds": 60,
  //       },
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //     });
  // }

  // sub();

  // console.log("TCL: YoutubeNewVideo -> res", res);

  return <p>Youtube notifications</p>;
}

export default YoutubeNewVideo;
