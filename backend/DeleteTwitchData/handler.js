'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const deleteTwitchData = require('./deleteTwitchData');

exports.handler = async (event) => {
  try {
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const YoutubeTokens = await deleteTwitchData({
      UserId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(YoutubeTokens),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (e) {
    console.log('e', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(e),
    };
  }
};
