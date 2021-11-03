'use strict';

const favoriteStreamsUpdate = require('./favoriteStreamsUpdate');

exports.handler = async (event) => {
  try {
    const { channels, authkey } = JSON.parse(event.body);

    if (!authkey) throw new Error('`authkey` is required');
    if (!channels) throw new Error('`Channels` is required');

    const res = await favoriteStreamsUpdate({
      channels,
      authkey,
    });
    console.log('res:', res);

    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes.favorite_streams),
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
    };
  } catch (e) {
    console.log('TCL: e', e);
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      // body: JSON.stringify(res.data),
    };
  }
};
