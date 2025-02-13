import {
    addJob,
    deleteJobs,
    getJob,
    getJobs,
    updateJob,
  } from "../controllers/jobCtrl.js";
  import express from "express";
  
  export const jobRouter = express.Router();
  
  jobRouter.route("/").get(getJobs).post(addJob);
  jobRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJobs);
  