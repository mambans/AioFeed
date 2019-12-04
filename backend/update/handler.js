"use strict";

const tokenUpdate = require("./tokenUpdate");

const handler = async event => {
  console.log("TCL: event", event);
  const { username, token, tokenName } = JSON.parse(event.body);

  if (!username) throw new Error("`Username` is required");
  if (!token) throw new Error("`Token` is required");
  if (!tokenName) throw new Error("`Token name` is required");

  const res = await tokenUpdate({
    username,
    token,
    tokenName,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
};

exports.handler = handler;
