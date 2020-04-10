"use strict";

const deleteAccount = require("./deleteAccount");

const handler = async (event) => {
  try {
    const { username, password, authKey } = JSON.parse(event.body);
    if (!username) throw { statusCode: 422, message: "Username is required" };
    if (!password) throw { statusCode: 422, message: "Password is required" };
    // if (!username) throw new Error("`Username` is required");
    // if (!password) throw new Error("`Password` is required");

    const res = await deleteAccount({ username, password, authKey });

    return {
      statusCode: res.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(res.data),
    };
  } catch (e) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(e),
    };
  }
};

exports.handler = handler;
