// configurar dotenv
require("dotenv").config();
const { MongoClient } = require("mongodb");

const { MONGODB_URI } = process.env;

class Db {
  constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db("issue_tracker_freecodecamp");
    console.log("Connected to MongoDB");
  }
}

module.exports = new Db();
