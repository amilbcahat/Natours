const express = require("express");

const tourController = require("../controllers/tourController.js");
const authController = require("./../controllers/authController.js");
const reviewController = require("./../controllers/reviewController.js");
const reviewRouter = require("./reviewRoutes");
const multer = require("multer");
const router = express.Router();

// router.param("id", tourController.checkID);
// router
//   .route("/:tourId/review")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

router.use("/:tourId/review", reviewRouter);

router.param("id", (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  next();
});

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guides"),
    tourController.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  )
  .get(tourController.getAllTours);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  )
  .post(tourController.createTour);

module.exports = router;
