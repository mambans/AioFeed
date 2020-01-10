/**
 * Route for biblioteket.
 */

const axios = require("axios");

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
  const vodChannels = await notifies.addVodChannels(req.body.channelName);

  res.json({ channels: vodChannels });
});

router.delete("/vod-channels", async (req, res) => {
  const vodChannels = await notifies.removeVodChannels(req.body.channelName);

  res.json({ channels: vodChannels });
});

router.post("/account/create", async (req, res) => {
  if (!req.body.accountName || !req.body.accountEmail || !req.body.accountPassword) {
    res.status(400).send("Please enter a username, email and password.");
  }
  bcrypt.hash(req.body.accountPassword, 10, async function(err, hash) {
    notifies
      .createAccount(req.body.accountName, req.body.accountEmail, hash)
      .then(par => {
        if (par && par[0].username) {
          res.status(200).send("Account successfully created");
        }
      })
      .catch(error => {
        console.error(error);
        if (error.sqlMessage.includes("PRIMARY")) {
          res.status(400).send("Username is already taken");
        } else if (error.sqlMessage.includes("email")) {
          res.status(400).send("Email is already taken");
        } else {
          res.status(400).send("Something went wrong with creating the account");
        }
      });
  });
});

router.post("/account/login", async (req, res) => {
  await notifies.loginAccount(req.body.accountName).then(user => {
    if (user.length === 0) {
      // res.json({ code: 401, message: "Incorrect username" });
      res.status(401).send("Incorrect username");
    } else {
      bcrypt.compare(req.body.accountPassword, user[0].password, function(err, valid) {
        if (valid) {
          delete user[0].password;
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

// router.post("/twitch/streams", async (req, res) => {
//   let data = await axios.get(`https://api.twitch.tv/helix/streams`, {
//     params: {
//       user_id: req.body.followedChannelsIds,
//     },
//     headers: {
//       Authorization: `Bearer 3sz4wql6sytxd4c6lpc5w87cog932e`,
//       "Client-ID": "o33xbyt10houyjmhjqr6gvvks38lo3",
//     },
//   });

//   console.log("TCL: data.user", data);

//   res.setHeader("Ratelimit-Limit", data.headers["ratelimit-limit"]);
//   res.setHeader("Ratelimit-Remaining", data.headers["ratelimit-remaining"]);
//   res.setHeader("Ratelimit-Reset", data.headers["ratelimit-reset"]);
//   res.setHeader("Content-Type", "text/plain");

//   res.send();
// });

module.exports = router;
