const mysql = require("promise-mysql");

module.exports = (app, connection) => {
    app.get("/", function(req, res) {
        res.render("index", { app });
    });
    app.get("/index", function(req, res) {
        res.render("index", { app });
    });
    app.get("/vod-channels", async function(req, res) {
        await connection.query("Call show_vod_channels;", function(error, data) {
            error ? res.send(error) : res.json({ channels: data });
        });
    });
};
