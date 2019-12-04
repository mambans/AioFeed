"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const bcrypt = require("bcrypt");
const util = require("util");
const compare = util.promisify(bcrypt.compare);

const login = async ({ username, password }) => {
  const res = await client
    .query({
      TableName: process.env.USERNAME_TABLE,
      KeyConditionExpression: "#Username = :InputUsername",
      ExpressionAttributeNames: {
        "#Username": "Username",
      },
      ExpressionAttributeValues: {
        ":InputUsername": username,
      },
    })
    .promise();
  console.log("TCL: login -> res", res);

  if (res.Items.length !== 0 && res.Count !== 0) {
    const valid = await compare(password, res.Items[0].Password);

    if (valid) {
      return {
        statusCode: 200,
        data: res,
      };
    } else {
      return {
        statusCode: 401,
        data: { message: "Invalid password." },
      };
    }
  }
};

module.exports = login;
