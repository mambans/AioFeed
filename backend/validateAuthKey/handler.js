'use strict';
const validateAuthKey = require('./validateAuthKey');

exports.handler = async (event) => {
  try {
    const { username, authkey } = JSON.parse(event.body);
    if (!username) throw { statusCode: 422, message: 'Username is required' };
    if (!authkey) throw { statusCode: 422, message: 'Auth key is required' };

    const authTokenValid = await validateAuthKey({ username, authkey });

    if (!authTokenValid) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': 'https://aiofeed.com',
        },
        body: JSON.stringify({ message: 'Invalid/expire Auth-key or username' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(authTokenValid),
    };
  } catch (e) {
    return {
      statusCode: e.statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(e),
    };
  }
};
