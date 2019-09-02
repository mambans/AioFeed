const express = require(`express`);
const mysql = require(`mysql`);
const config = require("./config.json");

const PORT = process.env.SERVER_PORT || 3100;

const app = express();

const connection = mysql.createConnection(config);

connection.connect(function(error) {
    error ? console.log(error) : console.log(connection);
});

require("./routes")(app, connection);

app.listen(PORT, () => {
    console.log(`App runing on port ${PORT}`);
});
