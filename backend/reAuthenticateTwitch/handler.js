'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const reAuthenticateTwitch = require('./reAuthenticateTwitch');

exports.handler = async (event) => {
  try {
    const { refresh_token } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!refresh_token) throw new Error('refresh_token` is required');

    const res = await reAuthenticateTwitch({
      refresh_token,
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
