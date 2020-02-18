"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");

const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const tokenUpdate = async ({ username, dataName, data }) => {
  const res = await client
    .update({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
      UpdateExpression: `set #dataName = :tokenValue`,
      ExpressionAttributeNames: { "#dataName": dataName },
      ExpressionAttributeValues: {
        ":tokenValue": data,
      },
    })
    .promise();

  return res;

  // console.log(res);
  // return {
  //   statusCode: 200,
  //   body: "Account successfully created.",
  // };
};
module.exports = tokenUpdate;
