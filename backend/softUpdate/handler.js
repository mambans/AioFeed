'use strict';

const softColumnUpdate = require('./softColumnUpdate');

exports.handler = async (event) => {
  try {
    const { username, columnValue, columnName, authkey } = JSON.parse(event.body);

    if (!username) throw new Error('`Username` is required');
    if (!columnValue) throw new Error('`Column value` is required');
    if (!columnName) throw new Error('`Column name` is required');
    if (!authkey) throw new Error('`Authkey` is required');

    const res = await softColumnUpdate({
      username,
      columnValue,
      columnName,
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
