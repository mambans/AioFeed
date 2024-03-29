'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ id, data, UserId }) => {
  const expressions =
    data &&
    Object.entries(data)
      .filter(([key, value]) => key !== 'id' || key !== 'username')
      .reduce(
        (acc, [key, value], currentIndex, array) => {
          if (key === 'username') return acc;

          const lastInArray =
            array.length === 1 || (array.length > 1 && currentIndex === array.length - 1);
          return {
            ...acc,
            UpdateExpression: acc.UpdateExpression + `#${key} = :${key}${lastInArray ? '' : ', '}`,
            ExpressionAttributeNames: { ...acc.ExpressionAttributeNames, [`#${key}`]: key },
            ExpressionAttributeValues: { ...acc.ExpressionAttributeValues, [`:${key}`]: value },
          };
        },
        {
          UpdateExpression: 'set ',
          ExpressionAttributeNames: {},
          ExpressionAttributeValues: {},
        }
      );

  const res = await client
    .update({
      TableName: process.env.CUSTOM_FEED_SECTIONS,
      Key: { UserId, id },
      ...expressions,
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  // const res = await client
  //   .update({
  //     TableName: process.env.CUSTOM_FEED_SECTIONS,
  //     Key: { Username: username },
  //     UpdateExpression: `set #Name = :data`,
  //     ExpressionAttributeNames: { '#Name': name },
  //     ExpressionAttributeValues: {
  //       ':data': data,
  //     },
  //     ReturnValues: 'ALL_NEW',
  //   })
  //   .promise();

  return res;
};
