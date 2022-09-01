const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours.json`)
);

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  //changes string into an array
  const tour = tours.find((el) => {
    el.id === id;
  });
  console.log(tour);
  //what find function here does is it see if the condition is true and if it is then it will return
  //for true values into the array tour
  if (id > tours.length) {
    return res.status(404).json({ message: "Invalid ID", status: "fail" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ message: "Invalid ID", status: "fail" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ message: "Invalid ID", status: "fail" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "updated tour is here",
    },
  });
};

const createTour = (req, res) => {
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
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success ",
    results: tours.length,
    data: {
      tours,
    },
  });
};

app.get("/api/v1/tours", getAllTours);

// app.post("/", (req, res) => {
//   res.status(404).send("Hello from the server side ");
// });

// app.get("/api/v1/tours/:id", getTour);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);

app.post("/api/v1/tours", createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)
  .post(createTour);

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
