const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
const port = 3000;

//1) Middleware
app.use(morgan("tiny"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/api/v1/tours", getAllTours);

// app.post("/", (req, res) => {
//   res.status(404).send("Hello from the server side ");
// });

// app.get("/api/v1/tours/:id", getTour);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);

// 3)ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
