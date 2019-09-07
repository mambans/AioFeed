module.exports = {
  vodChannels,
  addVodChannels,
  removeVodChannels,
};

const mysql = require("promise-mysql");
const config = require("../config/config.json");
let db;

/**
 * Main function.
 * @async
 * @returns void
 */
(async function() {
  db = await mysql.createConnection(config);

  process.on("exit", () => {
    db.end();
  });
})();

async function vodChannels() {
  let sql = "Call show_vod_channels;";
  let res;

  res = await db.query(sql);
  console.log(res);

  return res[0];
}

async function addVodChannels(channel) {
  console.log("\n--Adding channel: ", channel, " for vod monitoring.");

  let sql = `Call add_channel('${channel}');`;
  let res;

  res = await db.query(sql);
  console.log(res);

  return res[0];
}

async function removeVodChannels(channel) {
  let sql = `Call remove_channel('${channel}');`;
  let res;

  res = await db.query(sql);
  console.log(res);

  return res[0];
}
