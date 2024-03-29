'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const twitchUserDataUpdate = require('./twitchUserDataUpdate');

exports.handler = async (event) => {
  try {
    const { data, access_token, refresh_token } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const res = await twitchUserDataUpdate({
      data,
      access_token,
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
