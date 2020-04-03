"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const bcrypt = require("bcrypt");
const util = require("util");
const compare = util.promisify(bcrypt.compare);

const deleteAccount = async ({ username, password, authKey }) => {
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
    const validPassword = await compare(password, res.Items[0].Password);
    const validAuthKey = authKey === res.Items[0].AuthKey;

    if (!validPassword) {
      return {
        statusCode: 401,
        data: { message: "Invalid password." },
      };
    } else if (!validAuthKey) {
      return {
        statusCode: 401,
        data: { message: "Invalid authKey (relog)" },
      };
    } else {
      const auth_data = await client
        .delete({
          TableName: process.env.USERNAME_TABLE,
          Key: { Username: username },
          ReturnValues: "ALL_OLD",
        })
        .promise();

      return {
        statusCode: 200,
        data: auth_data,
      };
    }
  } else {
    return {
      statusCode: 401,
      data: { message: "Invalid Username" },
    };
  }
};

module.exports = deleteAccount;
