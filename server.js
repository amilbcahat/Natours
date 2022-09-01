const mongoose = require("mongoose");
const dotenv = require("dotenv");
//Catching Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception ! Shutting down");
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE;
//console
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

const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on Port ${port}...`);
});
//Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM recieved .Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated !");
  });
});
