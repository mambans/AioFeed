"use strict";

const columnUpdate = require("./columnUpdate");

const handler = async (event) => {
  try {
    const { username, columnValue, columnName } = JSON.parse(event.body);

    if (!username) throw new Error("`Username` is required");
    if (!columnValue) throw new Error("`Column value` is required");
    if (!columnName) throw new Error("`Column name` is required");

    const res = await columnUpdate({
      username,
      columnValue,
      columnName,
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
