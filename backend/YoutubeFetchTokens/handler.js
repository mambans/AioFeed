'use strict';

const YoutubeFetchTokens = require('./YoutubeFetchTokens');

exports.handler = async (event) => {
  try {
    console.log('handler -> event', event);
    const { code, authkey } = JSON.parse(event.body);
    if (!authkey) throw new Error('authkey is required');

    const YoutubeTokens = await YoutubeFetchTokens({
      code: decodeURIComponent(code),
      authkey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(YoutubeTokens),
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
