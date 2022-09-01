// const passport = require("passport");
// const GoogleStratergy = require("passport-google-oauth20").Stratergy;

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (user, done) {
//   done(err, user);
// });

// passport.use(
//   new GoogleStratergy(
//     {
//       clientID:
//         "164004968035-37rqjiosr63s1mvfhqknibcslgfe1cte.apps.googleusercontent.com",
//       clientSecret:
//         "164004968035-37rqjiosr63s1mvfhqknibcslgfe1cte.apps.googleusercontent.com",
//       callbackURL: "http://localhost:3000/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log("you have logged in");
//       return done(null, profile);
//     }
//   )
// );
