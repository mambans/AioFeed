'use strict';

const savedListsCreate = require('./savedListsCreate');

exports.handler = async (event) => {
  try {
    const { id, authkey, obj } = JSON.parse(event.body);

    if (!id) throw new Error('`List id missing');
    // if (!authkey) throw new Error('`Authkey` is required');

    const res = await savedListsCreate({
      authkey,
      id,
      obj: obj || {},
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
