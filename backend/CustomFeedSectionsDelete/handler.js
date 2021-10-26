'use strict';

const deleteCustomFeedSections = require('./deleteCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { username, name } = JSON.parse(event.body) || {};

    if (!username) throw new Error('`Username` is required');
    if (!name) throw new Error('`name` is required');

    const res = await deleteCustomFeedSections({
      username,
      name,
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
