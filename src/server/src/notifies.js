module.exports = {
  vodChannels,
  addVodChannels,
  removeVodChannels,
  createAccount,
  loginAccount,
  connectTwitch,
  connectYoutube,
  uploadProfileImage,
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

async function createAccount(name, email, password) {
  console.log("Creating  account: ");
  console.log("Username: ", name);
  console.log("Email: ", email);
  console.log("Password: ", password);

  let sql = `Call Create_Account('${name}', '${email}', '${password}');`;
  let res;

  res = await db.query(sql);
  console.log(res);

  return res[0];
  // return {
  //   name: name,
  //   password: password,
  //   email: email,
  // };
}

async function loginAccount(p_name, p_password) {
  console.log("Login account: ");
  console.log("Username: ", p_name);
  console.log("Password: ", p_password);

  let sql = `Call Account_Login(?, ?);`;
  // console.log("TCL: loginAccount -> sql", sql);

  let res;

  res = await db.query(sql, [p_name, p_password]);
  console.log("res api: ", res);

  return res[0];
  // return {
  //   name: name,
  //   password: password,
  //   email: email,
  // };
}

async function connectTwitch(p_name, p_email, p_token) {
  console.log("Login account: ");
  console.log("p_name: ", p_name);
  console.log("p_email: ", p_email);
  console.log("p_token: ", p_token);

  let sql = `CALL Update_TwitchToken(?, ?, ?);`;
  // console.log("TCL: loginAccount -> sql", sql);

  let res;

  res = await db.query(sql, [p_name, p_email, p_token]);
  console.log("res twitch token api: ", res);

  return res[0];
  // return {
  //   name: name,
  //   password: password,
  //   email: email,
  // };
}

async function connectYoutube(p_name, p_email, p_token) {
  console.log("Login account: ");
  console.log("p_name: ", p_name);
  console.log("p_email: ", p_email);
  console.log("p_token: ", p_token);

  let sql = `CALL Update_YoutubeToken(?, ?, ?);`;
  // console.log("TCL: loginAccount -> sql", sql);

  let res;

  res = await db.query(sql, [p_name, p_email, p_token]);
  console.log("res youtube token api: ", res);

  return res[0];
  // return {
  //   name: name,
  //   password: password,
  //   email: email,
  // };
}

async function uploadProfileImage(p_name, p_email, p_image) {
  console.log("Login account: ");
  console.log("p_name: ", p_name);
  console.log("p_email: ", p_email);
  console.log("p_image: ", p_image);

  let sql = `UPDATE accounts SET profile_img = ? WHERE username = ? AND email = ?;`;
  // console.log("TCL: loginAccount -> sql", sql);

  let res;

  res = await db.query(sql, [p_name, p_email, p_image]);
  console.log("res profile image token api: ", res);

  return res[0];
  // return {
  //   name: name,
  //   password: password,
  //   email: email,
  // };
}
