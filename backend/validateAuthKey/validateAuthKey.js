const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports = async ({
  username,
  authkey,
  returnPassword = false,
  returnYoutubeRefreshToken = false,
}) => {
  const AccountInfo = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (AccountInfo && AccountInfo.Item) {
    if (authkey !== AccountInfo.Item.AuthKey) return false;
    if (!returnPassword) delete AccountInfo.Item.Password;
    if (!returnYoutubeRefreshToken) delete AccountInfo.Item.YoutubePreferences.Refresh_token;
    return AccountInfo.Item;
  }
  return false;
};
