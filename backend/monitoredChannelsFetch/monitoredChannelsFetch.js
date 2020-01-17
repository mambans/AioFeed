"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");

const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const monitoredChannelsFetch = async ({ username, authkey }) => {
  // Key: { Username: username },
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (authkey === res.Item.AuthKey) {
    return res.Item.MonitoredChannels;
  } else {
    return false;
  }

  // console.log(res);
  // return {
  //   statusCode: 200,
  //   body: "Account successfully created.",
  // };
};
module.exports = monitoredChannelsFetch;
