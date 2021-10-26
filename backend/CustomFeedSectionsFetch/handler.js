'use strict';

const fetchCustomFeedSections = require('./fetchCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { username } = event.queryStringParameters || {};
    if (!username) throw new Error('`Username` is required');
    // if (!authkey) throw new Error('`Authkey` is required');

    const res = await fetchCustomFeedSections({
      username,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      // body: JSON.stringify(res.data),
    };
  }
};
