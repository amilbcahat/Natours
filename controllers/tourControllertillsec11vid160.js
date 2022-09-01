const fs = require("fs");
const AppError = require("../utils/appError.js");
const Tour = require("./../models/tourModel.js");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
exports.aliasTopTours = async (req, res, next) => {
  req.query.field = "name,price,ratingsAverage,summary,difficulty";
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  next();
};

exports.getTour = catchAsync(async (req, res, next) => {
  console.log(req.params);

  const tour = await Tour.findById(req.params.id).populate("review");
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({})
  // newTour.save()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestTime);

  //   // 1) Filtering
  //   console.log(req.query);
  //   const queryObj = { ...req.query };
  //   const excludedFields = ["page", "sort", "limit", "field"];
  //   excludedFields.forEach((el) => {
  //     delete queryObj[el];
  //   });
  //   // 2) Advanced Filtering
  //   let queryStr = JSON.stringify(queryObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
  //   let query = Tour.find(JSON.parse(queryStr));
  //   console.log(queryStr);
  //   3) Sorting
  //   console.log(req.query.sort);
  //   if (req.query.sort) {
  //     const sortBy = req.query.sort.replace(/,/g, " ");
  //     //or replace by req.query.sort.split(',').join('')
  //     query = query.sort(sortBy);
  //     console.log(sortBy);
  //     console.log(sortBy);
  //   } else {
  //     query = query.sort("-createdAt");
  //   }
  //   // 3) Field limiting
  //   if (req.query.field) {
  //     const field = req.query.field.replace(/,/g, " ");
  //     //or replace by req.query.field.split(',').join('')
  //     query = query.select(field);
  //     // console.log(field);
  //   } else {
  //     query = query.select("-__v");
  //   }
  //   // 4) Pagination
  //   const page = req.query.page * 1 || 1;
  //   const limit = req.query.limit * 1 || 100;
  //   const skip = (page - 1) * limit;
  //   query = query.skip(skip).limit(limit);
  //   if (req.query.page) {
  //     const numTours = await Tour.countDocuments();
  //     if (skip >= numTours) {
  //       throw new Error("This page doesnt exist");
  //     }
  //   }
  //   // Execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
