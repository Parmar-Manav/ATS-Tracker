import { Job } from "../models/Job.js";
import asyncHandler from "express-async-handler";

//@desc  Add a new Job
//@route POST /Jobs
//@access Public
export const addJob = asyncHandler(async (req, res, next) => {
  //console.log("hello");
  const Jobs = req.body;
  // console.log(Jobs);
  if (!Jobs?.title) {
    // const error = new Error("Request body is empty or invalid.");
    // error.status = constants.VALIDATION_ERROR;
    // return next(error);
    res.status(400);
    throw new Error("Request body is empty or invalid.");
    // data = {success : false, message : "Request body is empty or invalid."};
    // return res.status(400).json(data); use this if you want to send response from here
  }

  if (Jobs.length > 1) {
    await Job.bulkCreate(Jobs);
  } else {
    await Job.create(Jobs);
  }
  res.status(201).json(Jobs);
});

//@desc Fetch all jobs
//@route GET /Jobs
//@access Public
export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.findAll();
  res.status(200).json(jobs);
});

// @desc Fetch a single job
// @route GET /Jobs/:id
// @access Public
export const getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByPk(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.status(200).json(job);
});

//@desc Update a job
//@route PATCH /Jobs/:id
//@access Public
export const updateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByPk(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  await job.update(req.body);
  res.status(200).json({ message: "Job Updated successfully!" , job});
});

//@desc Delete a job
//@route DELETE /Jobs/:id
//@access Public
export const deleteJobs = asyncHandler(async (req, res, next) => {
  const job = await Job.findByPk(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  await job.destroy();
  res.status(200).json({ message: "Job deleted successfully", job });
});
