'use strict';

const deleteList = require('./deleteList');

exports.handler = async (event) => {
  try {
    const { authkey, id } = JSON.parse(event.body) || {};

    if (!authkey) throw new Error('`authkey` is required');
    if (!id) throw new Error('`ListName` is required');

    const res = await deleteList({
      authkey,
      id,
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
