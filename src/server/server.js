const express = require(`express`);
const mysql = require(`mysql`);
const config = require("./config.json");

const PORT = process.env.SERVER_PORT || 3100;

const app = express();

const connection = mysql.createConnection(config);

connection.connect(function(error) {
    error ? console.log(error) : console.log(connection);
});

app.set("views", __dirname + "/views");
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine());

app.use(function(req, res, next) {
    const allowedOrigins = [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "127.0.0.1:3000",
        "localhost:3000",
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    // res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.setHeader("Access-Control-Allow-Credentials", true);

    next();
});

require("./routes")(app, connection);
app.listen(PORT, () => {
    console.log(`App runing on port ${PORT}`);
});
