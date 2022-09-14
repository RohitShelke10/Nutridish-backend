import express from "express";
const router = express.Router();
import { book } from "../controllers/bookingController";
import { requireAuth } from "../middleware/authMiddleware";

router.post("/", requireAuth, book);

export default router;
