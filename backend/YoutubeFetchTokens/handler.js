"use strict";

const YoutubeFetchTokens = require("./YoutubeFetchTokens");

const handler = async (event) => {
  try {
    console.log("handler -> event", event);
    const { code, username, authkey } = JSON.parse(event.body);
    if (!authkey) throw new Error("authkey is required");
    if (!username) throw new Error("username is required");

    const YoutubeTokens = await YoutubeFetchTokens({
      code: decodeURIComponent(code),
      username,
      authkey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(YoutubeTokens),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (e) {
    console.log("e", e);
    return {
      statusCode: 422,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

exports.handler = handler;
