'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const bcrypt = require('bcrypt');
const util = require('util');
const { validateAuthkey } = require('../authkey');
const compare = util.promisify(bcrypt.compare);

module.exports = async ({ password, authKey }) => {
  const username = await validateAuthkey(authKey);
  console.log('deleteAccount -> username', username);

  const res = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (res && res.Item) {
    const validPassword = await compare(password, res.Item.Password);

    if (!validPassword) {
      return {
        statusCode: 401,
        data: { message: 'Invalid password.' },
      };
    } else {
      const user = await client
        .delete({
          TableName: process.env.USERNAME_TABLE,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();
      const twitch = await client
        .delete({
          TableName: process.env.TWITCH_DATA_TABLE,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();
      const youtube = await client
        .delete({
          TableName: process.env.YOUTUBE_DATA_TABLE,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();
      const saed_lists = await client
        .delete({
          TableName: process.env.SAVED_LISTS,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();
      const feed_sections = await client
        .delete({
          TableName: process.env.CUSTOM_FEED_SECTIONS,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();
      const twitter = await client
        .delete({
          TableName: process.env.TWITTER_DATA_TABLE,
          Key: { Username: username },
          ReturnValues: 'ALL_OLD',
        })
        .promise();

      return {
        statusCode: 200,
        data: { user, twitch, youtube, saed_lists, feed_sections, twitter },
      };
    }
  } else {
    return {
      statusCode: 401,
      data: { message: 'Invalid Username' },
    };
  }
};
