'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId, id, obj: { title, videos, enabled } }) => {
  const res = await client
    .put({
      TableName: process.env.SAVED_LISTS,
      Item: {
        UserId,
        id,
        title,
        videos,
        enabled,
        created_date: new Date().toLocaleString(),
      },
      // ConditionExpression: 'attribute_not_exists(#Id)',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_OLD',
      // ExpressionAttributeNames: { '#id': 'Id' },
    })
    .promise();

  return res;
};
