const mysql = require("mysql");

module.exports = (app, connection) => {
    app.get("/", function(req, res) {});
    app.get("/index", function(req, res) {});
    app.get("/vod-channels", function(req, res) {
        connection.query("Call show_vod_channels;", function(error, data) {
            error ? res.send(error) : res.json({ channels: data });
        });
    });
};
