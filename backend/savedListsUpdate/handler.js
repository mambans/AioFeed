'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const savedListsUpdate = require('./savedListsUpdate');

exports.handler = async (event) => {
  try {
    const { id, obj } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!id) throw new Error('`Column name` is required');

    const res = await savedListsUpdate({
      UserId,
      id,
      obj,
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
