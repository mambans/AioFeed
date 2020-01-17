"use strict";

const tokenUpdate = require("./tokenUpdate");

const handler = async event => {
  try {
    const { username, token, tokenName } = JSON.parse(event.body);

    if (!username) throw new Error("`Username` is required");
    if (!token) throw new Error("`Token` is required");
    if (!tokenName) throw new Error("`Token name` is required");

    // const res = await tokenUpdate({
    const res = await tokenUpdate({
      username,
      token,
      tokenName,
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
