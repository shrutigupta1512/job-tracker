import { Request, Response } from "express";
import Job from "../models/Job";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addJob = async (req: Request, res: Response) => {
  try {
    const { company, role, status, dateApplied, jobLink, notes } = req.body;
    const job = await Job.create({
      userId: req.userId,
      company,
      role,
      status,
      dateApplied,
      jobLink,
      notes,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ userId: req.userId });
    const stats = {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === "Applied").length,
      interview: jobs.filter((j) => j.status === "Interview").length,
      offer: jobs.filter((j) => j.status === "Offer").length,
      rejected: jobs.filter((j) => j.status === "Rejected").length,
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};