'use strict';

const fetchLists = require('./fetchLists');

exports.handler = async (event) => {
  try {
    const { authkey } = event.queryStringParameters || {};
    if (!authkey) throw new Error('`authkey` is required');

    const res = await fetchLists({
      authkey,
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
