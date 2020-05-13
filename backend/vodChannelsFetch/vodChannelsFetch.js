"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

module.exports = async ({ username, authkey }) => {
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (authkey === res.Item.AuthKey) {
    return res.Item.MonitoredChannels;
  }
};
