"use strict";

const vodChannelsFetch = require("./vodChannelsFetch");

exports.handler = async (event) => {
  try {
    const { username, authkey } = event.queryStringParameters;

    if (!username) throw new Error("`Username` is required");
    if (!authkey) throw new Error("`Authkey` is required");

    const res = await vodChannelsFetch({
      username,
      authkey,
    }).catch((e) => {
      console.log(e);
    });
    console.log("handler -> res2", res);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
    };
  } catch (e) {
    console.log("TCL: e", e);
    return {
      statusCode: 422,
      // body: JSON.stringify(res.data),
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
    };
  }
};
