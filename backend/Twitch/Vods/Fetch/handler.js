'use strict';

const fetch = require('./fetch');

exports.handler = async (event) => {
  try {
    const { authkey } = event.queryStringParameters || {};
    if (!authkey) throw new Error('`Authkey` is required');

    const res = await fetch({
      authkey,
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
