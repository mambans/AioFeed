'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const savedListsCreate = require('./savedListsCreate');

exports.handler = async (event) => {
  try {
    const { id, obj } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!id) throw new Error('`List id missing');

    const res = await savedListsCreate({
      UserId,
      id,
      obj: obj || {},
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
