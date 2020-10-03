'use strict';

const deleteList = require('./deleteList');

exports.handler = async (event) => {
  try {
    const { username, listName } = JSON.parse(event.body) || {};

    if (!username) throw new Error('`Username` is required');
    if (!listName) throw new Error('`ListName` is required');

    const res = await deleteList({
      username,
      listName,
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
