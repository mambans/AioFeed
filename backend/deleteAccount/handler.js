"use strict";

// const deleteAccount = require("./deleteAccount");

const handler = async event => {
  console.log("TCL: event", event);
  try {
    const { username, password } = JSON.parse(event.body);
    console.log("TCL: username, password", username, password);
    if (!username) throw { statusCode: 422, message: "Username is required" };
    if (!password) throw { statusCode: 422, message: "Password is required" };
    // if (!username) throw new Error("`Username` is required");
    // if (!password) throw new Error("`Password` is required");

    // const res = await login({ username: "foobar", password: "password123" });
    // const result = await deleteAccount({ username, password }).then(res => {
    //   console.log("TCL: res", res);
    //   return {
    //     statusCode: res.statusCode,
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //     body: JSON.stringify(res.data),
    //   };
    // });

    return {
      statusCode: res.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({}),
    };

    // return result;
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
};

exports.handler = handler;
