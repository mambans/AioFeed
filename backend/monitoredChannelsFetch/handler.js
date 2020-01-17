"use strict";

const monitoredChannelsFetch = require("./monitoredChannelsFetch");

const handler = async event => {
  try {
    const { username, authkey } = event.queryStringParameters;

    if (!username) throw new Error("`Username` is required");
    if (!authkey) throw new Error("`Authkey` is required");

    const res = await monitoredChannelsFetch({
      username,
      authkey,
    }).catch(e => {
      console.log(e);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (e) {
    console.log("TCL: e", e);
    return {
      statusCode: 422,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      // body: JSON.stringify(res.data),
    };
  }
};

exports.handler = handler;
