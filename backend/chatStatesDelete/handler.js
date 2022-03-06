'use strict';

const deleteChatState = require('./deleteChatState');

exports.handler = async (event) => {
  try {
    const { authkey, channel_id } = JSON.parse(event.body) || {};

    if (!authkey) throw new Error('`authkey` is required');
    if (!channel_id) throw new Error('`channel_id` is required');

    const res = await deleteChatState({
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
