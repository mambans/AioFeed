'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const deleteCustomFeedSections = require('./deleteCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { id } = JSON.parse(event.body) || {};
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;
    if (!id) throw new Error('`id` is required');

    const res = await deleteCustomFeedSections({
      id,
      UserId,
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
      body: JSON.stringify(e),
    };
  }
};
