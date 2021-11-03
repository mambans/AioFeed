'use strict';

const deleteAccount = require('./deleteAccount');

exports.handler = async (event) => {
  try {
    const { password, authKey } = JSON.parse(event.body);
    if (!password) throw { statusCode: 422, message: 'Password is required' };
    // if (!username) throw new Error("`Username` is required");
    // if (!password) throw new Error("`Password` is required");

    const res = await deleteAccount({ password, authKey });

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
