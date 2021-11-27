'use strict';

const updateCustomFeedSections = require('./updateCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { id, data, authkey } = JSON.parse(event.body);

    if (!authkey) throw new Error('authkey mssing');
    if (!id) throw new Error('Id missing');
    // if (!authkey) throw new Error('`Authkey` is required');

    const res = await updateCustomFeedSections({
      id,
      data,
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
      // body: JSON.stringify(res.data),
    };
  }
};
