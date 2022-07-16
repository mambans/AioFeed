'use strict';

const { parseAuthorization } = require('../../../parseAuthorization');
const create = require('./create');

exports.handler = async (event) => {
  try {
    const { channel_id } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!channel_id) throw new Error('`channel_id` is required');

    const res = await create({
      channel_id,
      UserId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    console.log('TCL: e', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(e),
    };
  }
};
