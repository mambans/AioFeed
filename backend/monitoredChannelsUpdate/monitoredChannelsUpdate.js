"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");

const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const monitoredChannelsUpdate = async ({ username, channels }) => {
  const res = await client
    .update({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
      UpdateExpression: `set #channels = :channels`,
      ExpressionAttributeNames: { "#channels": "MonitoredChannels" },
      ExpressionAttributeValues: {
        ":channels": channels,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return res;

  // console.log(res);
  // return {
  //   statusCode: 200,
  //   body: "Account successfully created.",
  // };
};
module.exports = monitoredChannelsUpdate;
