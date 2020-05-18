// app.js

const express = require("express");
const bodyParser = require("body-parser");

const gameRoutes = require("./routes/game"); // Imports routes for the products
const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
const dev_db_url = "mongodb://aashish:aashish1@ds343887.mlab.com:43887/tambola";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", gameRoutes);

const port = 3000;

app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});
