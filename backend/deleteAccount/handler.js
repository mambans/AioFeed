'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const deleteAccount = require('./deleteAccount');

exports.handler = async (event) => {
  try {
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    const res = await deleteAccount({ UserId });

    return {
      statusCode: res.statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(res.data),
    };
  } catch (e) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(e),
    };
  }
};
