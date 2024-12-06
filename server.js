"use strict";

const express = require("express");
const expect = require("chai").expect;
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");
const connectDB = require("./config/db.js");
const path = require("path");
let app;
async function start() {
  app = express();

  app.use("/public", express.static(path.resolve("public")));

  app.use(cors({ origin: "*" })); //For FCC testing purposes only

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  try {
    await connectDB.connect();
    //Sample front-end
    app.route("/:project/").get(function (req, res) {
      res.sendFile(path.resolve("views", "issue.html"));
    });

    //Index page (static HTML)
    app.route("/").get(function (req, res) {
      res.sendFile(path.resolve("views", "index.html"));
    });

    //Routing for API
    apiRoutes(app);

    //For FCC testing purposes
    fccTestingRoutes(app);
  } catch (error) {
    res.json({ error: error.message });
  }

  //404 Not Found Middleware
  app.use(function (req, res, next) {
    res.status(404).type("text").send("Not Found");
  });
  //Start our server and tests!
  const listener = app.listen(process.env.PORT || 3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          console.log("Tests are not valid:");
          console.error(e);
        }
      }, 3500);
    }
  });

  return app;
}
start();

module.exports = app; //for testing
