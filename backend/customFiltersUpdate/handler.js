'use strict';

const customFiltersUpdate = require('./customFiltersUpdate');

exports.handler = async (event) => {
  try {
    const { username, filtesObj, authkey } = JSON.parse(event.body);

    if (!username) throw new Error('`Username` is required');
    if (!filtesObj) throw new Error('`Column value` is required');
    if (!authkey) throw new Error('`Authkey` is required');

    const res = await customFiltersUpdate({
      username,
      filtesObj,
      authkey,
    });

    if (res) {
      return {
        statusCode: 200,
        body: JSON.stringify(res),
        headers: {
          'Access-Control-Allow-Origin': 'https://aiofeed.com',
        },
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Invalid AuthKey' }),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    console.log('Error:   ', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      // body: JSON.stringify(res.data),
    };
  }
};
