"use strict";

const monitoredChannelsUpdate = require("./monitoredChannelsUpdate");

const handler = async event => {
  console.log("TCL: event", event);
  const { username, channels } = JSON.parse(event.body);

  if (!username) throw new Error("`Username` is required");
  if (!channels) throw new Error("`Channels` is required");

  // const result = await new Promise((resolve, reject) => {
  //   await monitoredChannelsUpdate({
  //   username,
  //   channels,
  // }).then((res) => {
  //   console.log("TCL: res", res)
  //   resolve(res)
  // }).catch((e) => {
  //     reject(e)
  // });
  // })

  await monitoredChannelsUpdate({
    username,
    channels,
  })
    .then(res => {
      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    })
    .catch(e => {
      console.log(e);
    });
};

exports.handler = handler;
