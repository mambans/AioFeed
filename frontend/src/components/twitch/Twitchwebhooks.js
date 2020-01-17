/* eslint no-unused-vars: 0 */ // --> OFF

import axios from "axios";
// eslint-disable-next-line
import React, { useEffect } from "react";
import Utilities from "../../utilities/Utilities";
/*
  TODO: Implement Webhooks.
  FIXME: Authendicationg error.
*/

function streamOnlineWebhook() {
  console.log("--streamOnlineWebhook");

  async function getAppToken() {
    const res = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_SECRET}&grant_type=client_credentials&scope=channel:read:subscriptions user:edit`
    );

    console.log("TCL: getAppToken -> res", res);
    document.cookie = `Twitch-app_token=${res.data.access_token}; path=/`;
    document.cookie = `Twitch-app_token_expire=${res.data.expires_in}; path=/`;
  }

  async function getSubs() {
    const asd = await axios.get(`https://api.twitch.tv/helix/webhooks/subscriptions`, {
      headers: {
        Authorization: `Bearer ${Utilities.getCookie("Twitch-app_token")}`,
      },
    });
    console.log("TCL: streamOnlineWebhook -> asd", asd);
  }

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
        body: {
          hub: {
            callback: `http://notifies.mambans.com.s3-website.eu-north-1.amazonaws.com/twitch/notifications`,
            mode: "subscribe",
            topic: "https://api.twitch.tv/helix/streams?user_id=62300805",
            lease_seconds: 0,
          },
        },
        headers: {
          Authorization: `OAuth ${Utilities.getCookie("Twitch-app_token")}`,
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
  }

  async function asdd() {
    const userWebhooks = await axios.get(`https://api.twitch.tv/helix/webhooks/subscriptions`, {
      headers: {
        Authorization: "Bearer " + Utilities.getCookie("Twitch-app_token"),
      },
    });
    console.log("GET: ", userWebhooks);
  }

  // getSubs();
  // getAppToken();
  asdd();
  fetchData();
  if (true) {
    return <p>Webhooks</p>;
  } else {
    return <p>false</p>;
  }
}

export default streamOnlineWebhook;
