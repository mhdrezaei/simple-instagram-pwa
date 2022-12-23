const mongoose = require("mongoose");
const Job = require("../models/jobs");
const ErrorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// get All Jobs => api/v1/alljobs
exports.getAllJob = catchAsyncErrors(async(req , res , next) => {
  const jobs = await Job.find();
  res.status(200).json({
    success : true , 
    data : jobs
  })
})

// search jobs => api/v1/job/search
exports.searchJob = catchAsyncErrors(async(req , res , next) => {
  console.log(req.body.keyword)
  let regex = new RegExp(req.body.keyword,'i');

  const job = await Job.find({
     $or: [
        {'title': regex},
        {'description': regex}
     ]
  }).exec(function(err,jobs){
    // console.log(jobs);
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        sucsses: false,
        message: "this job not founded!!!",
      });
    }
  
    res.status(200).json({
      success: true,
      data: jobs,
    });
  });

 
})
// add new job => api/v1/job/new
exports.addNewJob = catchAsyncErrors(async (req, res, next) => {
//   req.body.user = req.user.id;
console.log(req.body)
  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "job created!",
    data: job,
  });
});
