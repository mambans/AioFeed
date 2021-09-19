'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const bcrypt = require('bcrypt');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const compare = util.promisify(bcrypt.compare);
const AES = require('crypto-js/aes');
const enc = require('crypto-js/enc-utf8');

const decryptData = async (data, secretString) => {
  if (data) {
    const bytes = await AES.decrypt(data, secretString);
    return bytes.toString(enc);
  }
  return null;
};

module.exports = async ({ username, password }) => {
  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (res && res.Item) {
    const valid = await compare(password, res.Item.Password);

    if (valid) {
      const key = uuidv4();

      const data = await client
        .update({
          TableName: process.env.USERNAME_TABLE,
          Key: { Username: username },
          UpdateExpression: `set #auth_key = :key`,
          ExpressionAttributeNames: { '#auth_key': 'AuthKey' },
          ExpressionAttributeValues: {
            ':key': key,
          },
          ReturnValues: 'ALL_NEW',
        })
        .promise();

      const decryptedData = {
        Attributes: {
          ...data.Attributes,
          TwitchPreferences: data.Attributes.TwitchPreferences
            ? {
                ...data.Attributes.TwitchPreferences,
                Token: await decryptData(
                  data.Attributes.TwitchPreferences.Token,
                  'TwitchPreferences'
                ),
                Refresh_token: await decryptData(
                  data.Attributes.TwitchPreferences.Refresh_token,
                  'TwitchPreferences'
                ),
              }
            : {},

          YoutubePreferences: data.Attributes.YoutubePreferences
            ? {
                ...data.Attributes.YoutubePreferences,
                Token: await decryptData(
                  data.Attributes.YoutubePreferences.Token,
                  'YoutubePreferences'
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
        data: { message: 'Invalid Password' },
      };
    }
  } else {
    return {
      statusCode: 401,
      data: { message: 'Invalid Username' },
    };
  }
};
