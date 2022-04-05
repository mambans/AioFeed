'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const { validateAuthkey } = require('../authkey');

exports.handler = async (event) => {
  try {
    const { authkey } = JSON.parse(event.body);
    if (!authkey) throw { statusCode: 422, message: 'Auth key is required' };

    const username = await validateAuthkey(authkey);

    if (!username) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': 'https://aiofeed.com',
        },
        body: JSON.stringify({ message: 'Invalid/expire Auth-key or username' }),
      };
    }

    const res = await client
      .get({
        TableName: process.env.USERNAME_TABLE,
        Key: { Username: username },
      })
      .promise();

    if (!res || !res.Item) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': 'https://aiofeed.com',
        },
        body: JSON.stringify({ message: 'Invalid/expire login credentials' }),
      };
    }

    const { Password, ...data } = res.Item;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: e.statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(e),
    };
  }
};
