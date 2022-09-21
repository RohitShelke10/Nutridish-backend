import express from "express";
import {
  editProfile,
  getMenu,
  getOrders,
  getProfile,
} from "../controllers/usersController";
import { requireAuth } from "../middleware/authMiddleware";
const router = express.Router();

router.put("/", requireAuth, editProfile);

router.get("/", requireAuth, getProfile);

router.get("/menu", getMenu);

router.get("/orders", requireAuth, getOrders);

export default router;
