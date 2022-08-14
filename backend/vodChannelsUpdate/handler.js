'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const vodChannelsUpdate = require('./vodChannelsUpdate');

exports.handler = async (event) => {
  try {
    const { channels } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const res = await vodChannelsUpdate({
      channels,
      UserId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes.vod_channels),
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
