"use strict";

const create = require("./create");

exports.handler = async (event) => {
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

    if (res.data) {
      return {
        statusCode: 200,
        body: JSON.stringify(res.data),
        headers: {
          "Access-Control-Allow-Origin": "https://aiofeed.com",
        },
      };
    }
  } catch (e) {
    return {
      statusCode: e.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "https://aiofeed.com",
      },
      body: JSON.stringify(e),
    };
  }
};
