// const express = require("express");
// const app = express();
// const passport = require("passport");
// const cors = require("cors");
// const cookieSession = require("cookie-session");
// require("./googleauth20");

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(cookieSession({ name: "tuto-session", keys: ["key1", "key2"] }));

// app.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/google/callback",
//   (req, res) => {
//     failedRedirect: "/failed";
//   },
//   (req, res) => {
//     res.redirect("/good");
//     console.log("logged in");
//   }
// );

// app.get("/failed", (req, res) => {
//   res.status(200).send("You Failed to login");
// });

// app.get("/good", (req, res) => {
//   res.status(200).send("You successed to login");
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}...`);
// });
