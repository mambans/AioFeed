'use strict';

const deleteCustomFeedSections = require('./deleteCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { id, authkey } = JSON.parse(event.body) || {};
    if (!id) throw new Error('`id` is required');
    if (!authkey) throw new Error('`authkey` is required');

    const res = await deleteCustomFeedSections({
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
    return {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': 'https://aiofeed.com',
      },
      // body: JSON.stringify(res.data),
    };
  }
};
