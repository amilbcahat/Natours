const Tour = require("../models/tourModel.js");
const User = require("../models/userModel.js");
const Booking = require("../models/bookingModel.js");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get our data from collection
  const tours = await Tour.find();
  // console.log(tours);
  //2) Build template data
  // 3) Render that template using tour data from 1)
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render("account", {
    title: "Your Account",
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get the data , for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  //2) Build template
  //3) Render template using data from 1)

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all Bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  //tourIDS is an array of tour ids
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  //in operator will iterate through the values in tourIDs array

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );
  res.status(200).render("account", {
    title: "Your Account",
    user: updatedUser,
  });
});
