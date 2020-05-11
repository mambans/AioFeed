"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const bcrypt = require("bcrypt");
const util = require("util");
const hash = util.promisify(bcrypt.hash);
var uniqid = require("uniqid");

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

  const key = uniqid(`${username}-AuthKey:`);

  const res = await client
    .put({
      TableName: process.env.USERNAME_TABLE,
      Item: {
        Username: username,
        Email: email,
        Password: hashedPassword,
        MonitoredChannels: [],
        ProfileImg: "null",
        AuthKey: key,
        TwitterListId: "null",
      },
      ConditionExpression: "attribute_not_exists(Username) AND attribute_not_exists(Email)",
      ReturnItemCollectionMetrics: "SIZE",
      ReturnValues: "ALL_OLD",
    })
    .promise();

  return {
    data: {
      Username: username,
      Email: email,
      AuthKey: key,
    },
  };
};
module.exports = create;
