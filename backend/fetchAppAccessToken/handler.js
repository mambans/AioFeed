'use strict';

const fetchAppAccessToken = require('./fetchAppAccessToken');

exports.handler = async () => {
  try {
    const appToken = await fetchAppAccessToken();

    return {
      statusCode: 200,
      body: JSON.stringify(appToken),
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
