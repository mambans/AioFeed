/**
 * Route for biblioteket.
 */

const express = require("express");
const router = express.Router();
const notifies = require("../src/notifies.js");

// const urlencodedParser = bodyParser.urlencoded({ extended: false });

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

module.exports = router;
