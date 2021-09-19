'use strict';

const customFiltersFetch = require('./customFiltersFetch');

exports.handler = async (event) => {
  try {
    const { username, authkey } = event.queryStringParameters || {};

    if (!username) throw new Error('`Username` is required');
    if (!authkey) throw new Error('`Authkey` is required');

    const res = await customFiltersFetch({
      username,
      authkey,
    });

    if (res) {
      return {
        statusCode: 200,
        body: JSON.stringify(res),
        headers: {
          'Access-Control-Allow-Origin': 'https://aiofeed.com',
        },
      };
    }
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "'Invalid AuthKey'" }),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    console.log('Error: ', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  }
};
