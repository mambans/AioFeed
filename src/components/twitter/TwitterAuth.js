// import React from "react";
import axios from "axios";

function TwitterAuth() {
  const url = new URL(window.location.href);

  console.log(url);
  async function getAccessToken() {
    try {
      console.log(1);

      // const res = await axios.post(`https://api.twitter.com/oauth/request_token`, {
      //   params: {
      //     oauth_callback: "http://localhost:3000/auth/twitter/callback",
      //     oauth_consumer_key: "4QqSDbWW3ayO2PPLwoc3DW413",
      //   },
      // });

      const res = await axios.get(`https://api.twitter.com/1.1/statuses/home_timeline.json`, {});

      console.log("TCL: TwitterAuth -> res", res);
    } catch (error) {
      console.error("e", error);
    }
  }

  if (url.href === "http://localhost:3000/auth/twitter") {
    getAccessToken();
  }

  return "TwitterAuth";
}

export default TwitterAuth;
