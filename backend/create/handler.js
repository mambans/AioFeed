"use strict";

const create = require("./create");

const handler = async event => {
  const { username, email, password } = JSON.parse(event.body);

  if (!username) throw new Error("`Username` is required");
  if (!email) throw new Error("`Email` is required");
  if (!password) throw new Error("`Password` is required");

  const res = await create({
    username,
    email,
    password,
  });
  console.log("TCL: res", res);

  if (res.data) {
    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
    };
  }
  // else {
  //   return {
  //     statusCode: 401,
  //     message: "Username is already taken.",
  //   };
  // }
};

exports.handler = handler;
