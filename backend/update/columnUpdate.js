"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const CryptoJS = require("crypto-js");

const columnUpdate = async ({ username, columnValue, columnName }) => {
  const valueData = await (async () => {
    if (columnValue.Token) {
      const Hached_Token = await CryptoJS.AES.encrypt(columnValue.Token, columnName).toString();

      if (columnValue.Refresh_token) {
        const Hached_Refresh_token = await CryptoJS.AES.encrypt(
          columnValue.Refresh_token,
          columnName
        ).toString();

        return { ...columnValue, Token: Hached_Token, Refresh_token: Hached_Refresh_token };
      }
      return { ...columnValue, Token: Hached_Token };
    } else {
      return { ...columnValue };
    }
  })();

  const res = await client
    .update({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
      UpdateExpression: `set #column = :columnValue`,
      ExpressionAttributeNames: { "#column": columnName },
      ExpressionAttributeValues: {
        ":columnValue": valueData,
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

module.exports = columnUpdate;
