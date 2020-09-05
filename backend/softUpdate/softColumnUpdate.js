'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ username, columnValue, columnName, authkey }) => {
  const AccountInfo = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (authkey !== AccountInfo.Item.AuthKey) throw new Error('Invalid AuthKey');
  if (authkey === AccountInfo.Item.AuthKey) {
    const valueData = (() => {
      const existinfValue = AccountInfo.Item[columnName];

      if (existinfValue) {
        if (Array.isArray(existinfValue)) {
          return [...existinfValue, ...columnValue];
        }
        return { ...existinfValue, ...columnValue };
      }
      return columnValue;
    })();
    const res = await client
      .update({
        TableName: process.env.USERNAME_TABLE,
        Key: { Username: username },
        UpdateExpression: `set #column = :columnValue`,
        ExpressionAttributeNames: { '#column': columnName },
        ExpressionAttributeValues: {
          ':columnValue': valueData,
        },
      })
      .promise();
    return res;
  }
};
