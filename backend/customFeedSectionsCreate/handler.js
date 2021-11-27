'use strict';

const createCustomFeedSections = require('./createCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { data, id, authkey } = JSON.parse(event.body);

    if (!data) throw new Error('`Data` is required');
    if (!id) throw new Error('`Id` is required');
    if (!authkey) throw new Error('`Authkey` is required');

    const res = await createCustomFeedSections({
      data,
      id,
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
