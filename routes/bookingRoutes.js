const express = require("express");
const viewController = require("./../controllers/viewController.js");
const authController = require("./../controllers/authController.js");
const bookingController = require("./../controllers/bookingController.js");

const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:tourID", bookingController.getCheckoutSession);
router.use(authController.restrictTo("admin", "lead-guide"));
router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
