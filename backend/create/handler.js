"use strict";

const create = require("./create");


const handler = async event => {
  console.log("TCL: event", event);
  try {
    const { username, email, password } = JSON.parse(event.body);

    if (!username) throw new Error("Username is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

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
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (e) {
    console.log("TCL: e", e);
    return {
      statusCode: e.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(e),
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
