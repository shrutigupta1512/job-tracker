import { Router } from "express";
import {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
  getStats,
} from "../controllers/jobController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// All job routes are protected
router.use(authMiddleware);

router.get("/", getJobs);
router.post("/", addJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.get("/stats", getStats);

export default router;