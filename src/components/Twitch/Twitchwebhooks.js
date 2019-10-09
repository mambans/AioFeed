import axios from "axios";
// eslint-disable-next-line
import React, { useEffect } from "react";
import Utilities from "utilities/Utilities";

function streamOnlineWebhook() {
  //   useEffect(() => {
  //     async function fetchData() {
  //       const response = await axios.post(`https://api.twitch.tv/helix/webhooks/hub`, {
  //         params: {
  //           "hub.callback": "http://localhost:3000/twitch/notifications/callback",
  //           "hub.mode": "subscribe",
  //           "hub.topic": "https://api.twitch.tv/helix/streams?user_id=5678",
  //           "hub.lease_seconds": 60,
  //         },
  //         headers: {
  //           "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
  //         },
  //       });

  //       console.log(response);
  //     }

  //     fetchData();
  //   }, []);

  async function fetchData() {
    const response = await axios
      .post(`https://api.twitch.tv/helix/webhooks/hub`, {
        Body: {
          "hub.callback": `${process.env.localhost}:3000/twitch/auth`,
          "hub.mode": "subscribe",
          "hub.topic": "https://api.twitch.tv/helix/streams?user_id=62300805",
          "hub.lease_seconds": 0,
        },
        Headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          // Authorization: `Bearer ${Utilities.getCookie("Twitch-app_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          // client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });

    console.log("POST: ", response);

    // window.location.href = `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_SECRET}&grant_type=client_credentials`;

    // const appToken = await axios.post(
    //   `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_SECRET}&grant_type=client_credentials`
    // );
    // console.log("appToken: ", appToken);

    // document.cookie = `Twitch-app_token=${appToken.data.access_token}; path=/`;
    // document.cookie = `Twitch-app_token_expire=${appToken.data.expires_in}; path=/`;

    // const userWebhooks = await axios.get(`https://api.twitch.tv/helix/webhooks/subscriptions`, {
    //   headers: {
    //     Authorization: "Bearer " + Utilities.getCookie("Twitch-app_token"),
    //   },
    // });
    // console.log("GET: ", userWebhooks);
  }

  fetchData();

  if (true) {
    return <p>Webhooks</p>;
  }
}

export default streamOnlineWebhook;
