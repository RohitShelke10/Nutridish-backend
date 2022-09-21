import express from "express";
import {
  editProfile,
  getMenu,
  getOrders,
} from "../controllers/usersController";
import { requireAuth } from "../middleware/authMiddleware";
const router = express.Router();

router.put("/", requireAuth, editProfile);

router.get("/menu", getMenu);

router.get("/orders", requireAuth, getOrders);

export default router;
