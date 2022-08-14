'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const chatStatesFetch = require('./chatStatesFetch');

exports.handler = async (event) => {
  try {
    const { channel_id } = event.queryStringParameters || {};
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!channel_id) throw new Error('`channel_id` is required');

    const res = await chatStatesFetch({
      UserId,
      channel_id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (e) {
    console.log('e:', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(e),
    };
  }
};
