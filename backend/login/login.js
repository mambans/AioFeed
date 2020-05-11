"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const bcrypt = require("bcrypt");
const util = require("util");
const uniqid = require("uniqid");
const compare = util.promisify(bcrypt.compare);
const AES = require("crypto-js/aes");
const enc = require("crypto-js/enc-utf8");

const decryptData = async (data, secretString) => {
  if (data) {
    const bytes = await AES.decrypt(data, secretString);
    return bytes.toString(enc);
  }
  return null;
};

const login = async ({ username, password }) => {
  console.log("username", username);
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
      const key = uniqid(`${res.Items[0].Username}AuthKey`);

      const data = await client
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

      const decryptedData = {
        Attributes: {
          ...data.Attributes,
          YoutubeAccessToken: await decryptData(data.Attributes.YoutubeAccessToken, "AccessToken"),
          YoutubeRefreshToken: await decryptData(
            data.Attributes.YoutubeRefreshToken,
            "RefreshToken"
          ),
          TwitchPreferences: data.Attributes.TwitchPreferences
            ? {
                ...data.Attributes.TwitchPreferences,
                Token: await decryptData(
                  data.Attributes.TwitchPreferences.Token,
                  "TwitchPreferences"
                ),
                Refresh_token: await decryptData(
                  data.Attributes.TwitchPreferences.Refresh_token,
                  "TwitchPreferences"
                ),
              }
            : {},

          YoutubePreferences: data.Attributes.YoutubePreferences
            ? {
                ...data.Attributes.YoutubePreferences,
                Token: await decryptData(
                  data.Attributes.YoutubePreferences.Token,
                  "YoutubePreferences"
                ),
              }
            : {},
        },
      };

      return {
        statusCode: 200,
        data: decryptedData,
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
