/**
 * Route for biblioteket.
 */

const express = require("express");
const router = express.Router();
const notifies = require("../src/notifies.js");

const url = require("url");
const bodyParser = require("body-parser");
const querystring = require("querystring");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const upload = require("./uploadMiddleware");

router.get("/", (req, res) => {
  let data = {
    title: "Notifies | Home",
  };

  res.render("index", data);
});

router.get("/index", (req, res) => {
  let data = {
    title: "Notifies | Home",
  };

  res.render("index", data);
});

router.get("/vod-channels", async (req, res) => {
  let data = {
    title: "Notifies | Vod-channels",
  };

  data.data = await notifies.vodChannels();

  res.json({ channels: data.data });
});

router.post("/vod-channels", async (req, res) => {
  let data = {
    title: "Notifies | Vod-channels",
    channel: req.body.channelName,
  };

  await notifies.addVodChannels(req.body.channelName);

  res.send();
});

router.delete("/vod-channels", async (req, res) => {
  console.log("AAA: ", req.body.channelName);
  let data = {
    title: "Notifies | Vod-channels",
    channel: req.body.channelName,
  };

  await notifies.removeVodChannels(req.body.channelName);

  res.send();
});

router.post("/account/create", async (req, res) => {
  let data = {
    title: "Notifies | Create Account",
    channel: req.body.channelName,
  };

  await notifies.createAccount(
    req.body.accountName,
    req.body.accountEmail,
    req.body.accountPassword
  );

  res.send();
});

router.post("/account/login", async (req, res) => {
  let data = {
    title: "Notifies | Create Account",
    channel: req.body.channelName,
  };

  // console.log("1: ", req.query.accountName);
  // console.log("2: ", req.query.accountPassword);

  console.log("1: ", req.body.accountName);
  console.log("2: ", req.body.accountPassword);

  data.user = await notifies.loginAccount(req.body.accountName, req.body.accountPassword);

  console.log("TCL: data.user", data.user);

  res.json({ account: data.user });
});

router.put("/account/twitch/connect", async (req, res) => {
  let data = {
    title: "Notifies | Update Twitch Token",
  };

  // console.log("1: ", req.query.accountName);
  // console.log("2: ", req.query.accountPassword);

  console.log("1: ", req.body.accountName);
  console.log("2: ", req.body.accountEmail);
  console.log("2: ", req.body.twitchToken);

  data.user = await notifies.connectTwitch(
    req.body.accountName,
    req.body.accountEmail,
    req.body.twitchToken
  );

  res.json({ account: data.user });
});

router.put("/account/youtube/connect", async (req, res) => {
  let data = {
    title: "Notifies | Update Youtube Token",
  };

  // console.log("1: ", req.query.accountName);
  // console.log("2: ", req.query.accountPassword);

  console.log("1: ", req.body.accountName);
  console.log("2: ", req.body.accountEmail);
  console.log("2: ", req.body.youtubeToken);

  data.user = await notifies.connectYoutube(
    req.body.accountName,
    req.body.accountEmail,
    req.body.youtubeToken
  );

  res.json({ account: data.user });
});

router.put("/account/profile/image", async (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });

  let data = {
    title: "Notifies | Update Profile Image",
  };

  console.log("1: ", req.body.accountName);
  console.log("2: ", req.body.accountEmail);
  console.log("2: ", req.body.profileImage);

  // return res.status(200).json({ name: filename });

  data.user = await notifies.uploadProfileImage(
    req.body.accountName,
    req.body.accountEmail,
    req.body.profileImage
  );

  // res.json({ account: data.user });
});

module.exports = router;
