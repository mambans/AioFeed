'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const youtubeUserDataUpdate = require('./youtubeUserDataUpdate');

exports.handler = async (event) => {
  try {
    const { data, access_token, refresh_token } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const res = await youtubeUserDataUpdate({
      data,
      access_token,
      refresh_token,
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
