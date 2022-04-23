'use strict';

const deleteFunc = require('./delete');

exports.handler = async (event) => {
  try {
    const { channel_id, authkey } = JSON.parse(event.body) || {};
    if (!channel_id) throw new Error('`channel_id` is required');
    if (!authkey) throw new Error('`authkey` is required');

    const res = await deleteFunc({
      channel_id,
      authkey,
    });

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
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      body: JSON.stringify(e),
    };
  }
};
