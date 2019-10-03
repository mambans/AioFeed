/**
 * Route for biblioteket.
 */

const express = require("express");
const router = express.Router();
const notifies = require("../src/notifies.js");

const bcrypt = require("bcrypt");

// const url = require("url");
// const bodyParser = require("body-parser");
// const querystring = require("querystring");

// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// const upload = require("./uploadMiddleware");

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
  await notifies.addVodChannels(req.body.channelName);

  res.send();
});

router.delete("/vod-channels", async (req, res) => {
  await notifies.removeVodChannels(req.body.channelName);

  res.send();
});

router.post("/account/create", async (req, res) => {
  bcrypt.hash(req.body.accountPassword, 10, async function(err, hash) {
    notifies.createAccount(req.body.accountName, req.body.accountEmail, hash).then(par => {
      if (par && par[0].username) {
        console.log("TCL: par[0].username", par[0].username);
        res.status(200).send("Account successfully created");
      }
    });
  });
});

router.post("/account/login", async (req, res) => {
  await notifies.loginAccount(req.body.accountName, req.body.accountPassword).then(user => {
    if (user.length === 0) {
      // res.json({ code: 401, message: "Incorrect username" });
      res.status(401).send("Incorrect username");
    } else {
      bcrypt.compare(req.body.accountPassword, user[0].password, function(err, valid) {
        if (valid) {
          res.json({ account: user[0] });
        } else {
          res.status(401).send("Incorrect password");
          // res.json({ code: 401, message: "Incorrect password" });
        }
      });
    }
  });
});

router.put("/account/twitch/connect", async (req, res) => {
  let data = {
    title: "Notifies | Update Twitch Token",
  };

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

  data.user = await notifies.connectYoutube(
    req.body.accountName,
    req.body.accountEmail,
    req.body.youtubeToken
  );

  res.json({ account: data.user });
});

router.put("/account/profile/image", async (req, res) => {
  let data = {
    title: "Notifies | Update Profile Image",
  };

  data.user = await notifies.updateProfileImg(
    req.body.profileImage,
    req.body.accountName,
    req.body.accountEmail
  );

  res.json({ account: data.user });
});

module.exports = router;
