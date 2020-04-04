"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const bcrypt = require("bcrypt");
const util = require("util");
var uniqid = require("uniqid");
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

  if (res.Items.length !== 0 && res.Count !== 0) {
    const valid = await compare(password, res.Items[0].Password);

    if (valid) {
      const key = uniqid(`${res.Items[0].Username}-AuthKey:`);

      const auth_data = await client
        .update({
          TableName: process.env.USERNAME_TABLE,
          Key: { Username: username },
          UpdateExpression: `set #auth_key = :key`,
          ExpressionAttributeNames: { "#auth_key": "AuthKey" },
          ExpressionAttributeValues: {
            ":key": key,
          },
          ReturnValues: "ALL_NEW",
        })
        .promise();

      return {
        statusCode: 200,
        data: auth_data,
      };
    } else {
      return {
        statusCode: 401,
        data: { message: "Invalid Password" },
      };
    }
  } else {
    return {
      statusCode: 401,
      data: { message: "Invalid Username" },
    };
  }
};

module.exports = login;
