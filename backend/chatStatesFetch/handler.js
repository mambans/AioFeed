'use strict';

const chatStatesFetch = require('./chatStatesFetch');

exports.handler = async (event) => {
  try {
    const { authkey, channel_id } = event.queryStringParameters || {};
    console.log('channel_id11:', channel_id);
    if (!authkey) throw new Error('`authkey` is required');

    const res = await chatStatesFetch({
      authkey,
      channel_id,
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
