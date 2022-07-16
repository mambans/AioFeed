'use strict';

const { parseAuthorization } = require('../parseAuthorization');
const createCustomFeedSections = require('./createCustomFeedSections');

exports.handler = async (event) => {
  try {
    const { data, id } = JSON.parse(event.body);
    const { Authorization } = event.headers || {};
    const authData = await parseAuthorization(Authorization);
    const UserId = authData.sub;

    if (!data) throw new Error('`Data` is required');
    if (!id) throw new Error('`Id` is required');

    const res = await createCustomFeedSections({
      data,
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
