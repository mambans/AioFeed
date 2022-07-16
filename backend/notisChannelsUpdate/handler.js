'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const notisChannelsUpdate = require('./notisChannelsUpdate');

exports.handler = async (event) => {
  try {
    const { channels } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const res = await notisChannelsUpdate({
      channels,
      UserId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes.channel_update_notis),
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
