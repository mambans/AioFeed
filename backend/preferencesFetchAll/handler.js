'use strict';

const preferencesFetchAll = require('./preferencesFetchAll');

exports.handler = async (event) => {
  try {
    const { username, authkey } = event.queryStringParameters;

    if (!username) throw new Error('`Username` is required');
    if (!authkey) throw new Error('`Authkey` is required');

    const res = await preferencesFetchAll({
      username,
      authkey,
    }).catch((e) => console.log(e));

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
      // body: JSON.stringify(res.data),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  }
};
