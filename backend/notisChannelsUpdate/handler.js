'use strict';

const notisChannelsUpdate = require('./notisChannelsUpdate');

exports.handler = async (event) => {
  try {
    const { channels, authkey } = JSON.parse(event.body);

    if (!authkey) throw new Error('`authkey` is required');

    const res = await notisChannelsUpdate({
      channels,
      authkey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes.channel_update_notis),
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
