import express from "express";
import JobController from "../controllers/JobController.js";

const jobRoutes = express.Router();

const jobController = new JobController();

jobRoutes.get("/api/v1/jobs", jobController.getAllJobs);

jobRoutes.get("/api/v1/jobs/:id", jobController.getJobById);

jobRoutes.post("/api/v1/jobs", jobController.createJob);

jobRoutes.put("/api/v1/jobs/:id", jobController.updateJob);

jobRoutes.delete("/api/v1/jobs/:id", jobController.deleteJob);

export default jobRoutes;

