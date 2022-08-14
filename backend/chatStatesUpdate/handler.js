'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const chatStatesUpdate = require('./chatStatesUpdate');

exports.handler = async (event) => {
  try {
    const { data, channel_id } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    if (!channel_id) throw new Error('`channel_id` is required');

    const res = await chatStatesUpdate({
      data,
      channel_id,
      UserId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (e) {
    console.log('TCL: e', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(e),
    };
  }
};
