const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

module.exports = async ({ authkey, username }) => {
  console.log("username", username);

  const AccountInfo = await client
    .get({
      TableName: process.env.USERNAME_TABLE,
      Key: { Username: username },
    })
    .promise();

  if (authkey !== AccountInfo.Item.AuthKey) throw new Error("Invalid AuthKey");

  if (authkey === AccountInfo.Item.AuthKey) {
    return await client
      .update({
        TableName: process.env.USERNAME_TABLE,
        Key: { Username: AccountInfo.Item.Username },
        UpdateExpression: `REMOVE #Preferences`,
        ExpressionAttributeNames: {
          "#Preferences": "YoutubePreferences",
        },
      })
      .promise();
  }
};
