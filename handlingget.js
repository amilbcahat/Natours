const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;
app.use(express.json());
// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello from the server side ", app: "Natours" });
// });

// app.post("/", (req, res) => {
//   res.status(404).send("Hello from the server side ");
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;

  //Gives the newID with 1 incremented value to the last object of id
  const newTour = Object.assign({ id: newId }, req.body);
  // merges the two objects together of req body and the newId
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours.json`,
    JSON.stringify(tours),
    //data which we have to write into
    (err) => {
      res.status(201).json({
        //201 status code stands for created ,symbol for new resource
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
