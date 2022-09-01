const Review = require("./models/reviewModel");
const fs = require("fs");

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/reviews.json`, "utf-8")
);
async function greet() {
  await Review.create(reviews, { validateBeforeSave: false });
}

greet();

console.log("added");

console.log("Done");

process.exit();
