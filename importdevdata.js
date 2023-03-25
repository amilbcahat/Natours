const fs = require("fs");
const Tour = require("./models/tourModel.js");
const Review = require(`${__dirname}/models/reviewModel.js`);
const User = require("./models/userModel.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createVerify } = require("crypto");
const cookieSession = require("cookie-session");
const { getAllTours } = require("./controllers/tourController.js");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("Database connected");
  });
//Import data into DB
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/reviews.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/users.json`, "utf-8")
);
const importData = async () => {
  try {
    // console.log(review);
    await User.create(users, { validateBeforeSave: false });

    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete data from db
const deleteData = async () => {
  try {
    await User.deleteMany();
    process.exit();
    console.log("Data Successfully deleted");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
