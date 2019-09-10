import axios from "axios";
// eslint-disable-next-line
import React, { useEffect } from "react";

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
    const response = await axios.post(`https://api.twitch.tv/helix/webhooks/hub`, {
      params: {
        "hub.callback": "http://localhost:3000/twitch/notifications/callback",
        "hub.mode": "subscribe",
        "hub.topic": "https://api.twitch.tv/helix/streams?user_id=5678",
        "hub.lease_seconds": 60,
      },
      //   headers: {
      //     authorization_code: localStorage.getItem("access_token"),
      //   },
    });

    console.log(response);

    // const userWebhooks = axios.get(`https://api.twitch.tv/helix/webhooks/subscriptions`, {

    // });
  }

  fetchData();

  if (true) {
    return <p>Webhooks</p>;
  }
}

export default streamOnlineWebhook;
