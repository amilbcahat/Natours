const express = require("express");
const viewController = require("./../controllers/viewController.js");
const authController = require("./../controllers/authController.js");
const bookingController = require("./../controllers/bookingController.js");

const router = express.Router();

router.use(viewController.alerts);

router.get(
  "/",

  authController.isLoggedIn,
  viewController.getOverview
);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewController.getSignupForm);

router.get("/me", authController.protect, viewController.getAccount);
router.get(
  "/my-tours",
  // bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

router.post("/submit-user-data", viewController.updateUserData);
//Login

module.exports = router;
