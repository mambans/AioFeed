"use strict";

const login = require("./login");

const handler = async event => {
  console.log("TCL: event", event);
  // const { username, password } = JSON.parse(event.body);
  const { username, password } = event.body;
  if (!username) throw new Error("`Username` is required");
  if (!password) throw new Error("`Password` is required");

  // const res = await login({ username: "foobar", password: "password123" });
  const result = await login({ username, password }).then(res => {
    console.log("TCL: res", res);
    return {
      statusCode: res.statusCode,
      isBase64Encoded: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(res.data),
    };
  });

  return result;
};

exports.handler = handler;
