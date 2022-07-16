'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const deleteChatState = require('./deleteChatState');

exports.handler = async (event) => {
  try {
    const { channel_id } = JSON.parse(event.body) || {};
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!channel_id) throw new Error('`channel_id` is required');

    const res = await deleteChatState({
      UserId,
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
      body: JSON.stringify(e),
    };
  }
};
