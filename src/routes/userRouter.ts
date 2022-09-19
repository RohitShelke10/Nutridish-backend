import express from "express";
import { editProfile } from "../controllers/usersController";
import { requireAuth } from "../middleware/authMiddleware";
const router = express.Router();

router.put("/", requireAuth, editProfile);

export default router;
