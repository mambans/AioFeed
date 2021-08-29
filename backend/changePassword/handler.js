'use strict';

const changePassword = require('./changePassword');

exports.handler = async (event) => {
  try {
    const { username, password, authkey, new_password } = JSON.parse(event.body);

    if (!username) throw { statusCode: 422, message: 'Username is required' };
    if (!password) throw { statusCode: 422, message: 'Password is required' };
    if (!new_password) throw { statusCode: 422, message: 'New password is required' };
    if (!authkey) throw { statusCode: 422, message: 'Authkey is required' };

    const result = await changePassword({ username, password, new_password, authkey });

    return {
      statusCode: result.statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(result.data),
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
