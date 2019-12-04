"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");

const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const tokenUpdate = async ({ username, token, tokenName }) => {
  const res = await client
    .update({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
      UpdateExpression: `set #token = :tokenValue`,
      ExpressionAttributeNames: { "#token": tokenName },
      ExpressionAttributeValues: {
        ":tokenValue": token,
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
