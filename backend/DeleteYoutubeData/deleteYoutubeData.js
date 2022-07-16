const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({ UserId }) => {
  return await client
    .update({
      TableName: process.env.YOUTUBE_DATA_TABLE,
      Key: { UserId },
      UpdateExpression: `REMOVE #access_token, #refresh_token, #user`,
      ExpressionAttributeNames: {
        '#access_token': 'access_token',
        '#refresh_token': 'refresh_token',
        '#user': 'user',
      },
    })
    .promise();
};
