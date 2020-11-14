'use strict';

const fetchAppAccessToken = require('./fetchAppAccessToken');

exports.handler = async (event) => {
  try {
    const { user_id, user_login } = event.queryStringParameters;

    // MAYBE Change to just return the ENCRYPTED app token to the client (to replace its none existant access token) instead of making all the Twitch streaminfo api calls on the server.

    const appToken = await fetchAppAccessToken(
      user_id ? { user_id: user_id } : { user_login: user_login }
    );

    // NOT DONE

    return {
      statusCode: 200,
      body: JSON.stringify(appToken),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    console.log('e', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  }
};
