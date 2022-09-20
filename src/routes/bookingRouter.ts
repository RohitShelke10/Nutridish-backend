import express from "express";
const router = express.Router();
import { book, createOrder } from "../controllers/bookingController";
import { requireAuth } from "../middleware/authMiddleware";

router.post("/", requireAuth, book);

router.post("/paymentlink", requireAuth, createOrder);

export default router;
