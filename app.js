const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const port = 3000;
const compression = require("compression");
const viewRouter = require("./routes/viewRoutes.js");
const cookieParser = require("cookie-parser");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const bookingRouter = require("./routes/bookingRoutes.js");
const bookingController = require("./controllers/bookingController.js");

const cors = require("cors");
const AppError = require("./utils/appError");
app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//1)Global Middlewares
//Implementing CORS
app.use(cors());
//app.use(cors({
// origin: 'https://www.natours.com'
//}))
app.options("*", cors());
//app.options('/api/v1/tours/:id , cors())
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Rate limiter ,limits request from same Api
const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP ,please try in an hour !",
});

app.use("/api", limiter);

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webhookCheckOut
);

//Body parser
app.use(express.json());
app.use(cookieParser());
//Data sanitization against No sql query injection
app.use(mongoSanitize());
//XSS prevention'
app.use(xss());
//Helmet , sets Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

//Parameter prevention
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
//Serving static files
app.use(express.static(path.join(__dirname, "/starter/public")));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
//Test Middleware
app.use((req, res, next) => {
  // console.log("Hello from the middleware");
  next();
});
app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

// app.post("/", (req, res) => {
//   res.status(404).send("Hello from the server side ");
// });

// app.get("/api/v1/tours/:id", getTour);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);

// 3)ROUTES
app.use("/", viewRouter);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Cant find ${req.originalUrl} on this server`,

  // });
  // const err = new Error(`Cant find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = "fail";

  next(new AppError(`Cant find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
