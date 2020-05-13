"use strict";

const deleteYoutubeData = require("./deleteYoutubeData");

exports.handler = async (event) => {
  try {
    const { username, authkey } = JSON.parse(event.body);
    if (!authkey) throw new Error("authkey is required");
    if (!username) throw new Error("username is required");

    const YoutubeTokens = await deleteYoutubeData({
      username,
      authkey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(YoutubeTokens),
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
    };
  } catch (e) {
    console.log("e", e);
    return {
      statusCode: 422,
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
    };
  }
};
