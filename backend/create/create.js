"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const bcrypt = require("bcrypt");
const util = require("util");
const hash = util.promisify(bcrypt.hash);

const create = async ({ username, email, password }) => {
  // const userExist = await client
  //   .query({
  //     TableName: process.env.USERNAME_TABLE,
  //     KeyConditionExpression: "#Username = :InputUsername",
  //     ExpressionAttributeNames: {
  //       "#Username": "Username",
  //     },
  //     ExpressionAttributeValues: {
  //       ":InputUsername": username,
  //     },
  //   })
  //   .promise();

  // if (userExist.Items.length === 0 && userExist.Count === 0) {
  const hashedPassword = await hash(password, 10);

  return {
    data: await client
      .put({
        TableName: process.env.USERNAME_TABLE,
        Item: {
          Username: username,
          Email: email,
          Password: hashedPassword,
          TwitchToken: null,
          YoutubeToken: null,
          MonitoredChannels: [],
        },
        ConditionExpression: "attribute_not_exists(Username)",
        ReturnItemCollectionMetrics: "SIZE",
        ReturnValues: "ALL_OLD",
      })
      .promise(),
  };
  // } else {
  //   return {
  //     statusCode: 401,
  //     data: { message: "Username is already taken." },
  //   };
  //   // return "Username is already taken.";
  // }
};
module.exports = create;
