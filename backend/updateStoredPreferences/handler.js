"use strict";

const update = require("./update");

const handler = async event => {
  try {
    const { username, dataName, data } = JSON.parse(event.body);

    if (!username) throw new Error("`Username` is required");
    if (!dataName) throw new Error("`DataName` is required");
    if (!data) throw new Error("`Data` is required");

    const res = await update({
      username,
      dataName,
      data,
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
