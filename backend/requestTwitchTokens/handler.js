"use strict";

const requestTwitchTokens = require("./requestTwitchTokens");

const handler = async (event) => {
  try {
    const { authCode } = JSON.parse(event.body);

    if (!authCode) throw new Error("authCode` is required");

    const res = await requestTwitchTokens({
      authCode,
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
