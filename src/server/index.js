const port = process.env.SERVER_PORT || 3100;
const path = require("path");
const express = require("express");
const app = express();
const middleware = require("./middleware/index.js");
const routeExam = require("./route/notifies.js");

const bodyParser = require("body-parser");

app.set("view engine", "ejs");

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

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(middleware.logIncomingToConsole);
app.use(express.static(path.join(__dirname, "public")));
app.use("/notifies", routeExam);
app.listen(port, logStartUpDetailsToConsole);

function logStartUpDetailsToConsole() {
  let routes = [];

  // Find what routes are supported
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === "router") {
      // Routes added as router middleware
      middleware.handle.stack.forEach(handler => {
        let route;

        route = handler.route;
        route && routes.push(route);
      });
    }
  });

  console.info(`Server is listening on port ${port}.`);
  console.info("Available routes are:");
  console.info(routes);
}
