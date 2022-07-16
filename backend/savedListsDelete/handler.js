'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const deleteList = require('./deleteList');

exports.handler = async (event) => {
  try {
    const { id } = JSON.parse(event.body) || {};
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!id) throw new Error('`ListName` is required');

    const res = await deleteList({
      UserId,
      id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(e),
    };
  }
};
