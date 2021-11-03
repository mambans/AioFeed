'use strict';

const deleteCustomFeedSections = require('./deleteCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { name, authkey } = JSON.parse(event.body) || {};
    if (!name) throw new Error('`name` is required');
    if (!authkey) throw new Error('`authkey` is required');

    const res = await deleteCustomFeedSections({
      name,
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
