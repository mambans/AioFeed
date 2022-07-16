'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const twitterDataFetch = require('./twitterDataFetch');

exports.handler = async (event) => {
  try {
    const { Authorization } = event.headers || {};

    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const res = await twitterDataFetch({
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
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(e),
    };
  }
};
