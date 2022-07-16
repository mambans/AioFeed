'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const bcrypt = require('bcrypt');
const util = require('util');
const compare = util.promisify(bcrypt.compare);

module.exports = async ({ UserId }) => {
  console.log('deleteAccount -> UserId', UserId);

  const user = await client
    .delete({
      TableName: process.env.USERNAME_TABLE,
      Key: { UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();
  const twitch = await client
    .delete({
      TableName: process.env.TWITCH_DATA_TABLE,
      Key: { UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();
  const youtube = await client
    .delete({
      TableName: process.env.YOUTUBE_DATA_TABLE,
      Key: { UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();
  const saed_lists = await client
    .delete({
      TableName: process.env.SAVED_LISTS,
      Key: { UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();
  const feed_sections = await client
    .delete({
      TableName: process.env.CUSTOM_FEED_SECTIONS,
      Key: { UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();
  const twitter = await client
    .delete({
      TableName: process.env.TWITTER_DATA_TABLE,
      Key: { UserId },
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return {
    statusCode: 200,
    data: { user, twitch, youtube, saed_lists, feed_sections, twitter },
  };
};
