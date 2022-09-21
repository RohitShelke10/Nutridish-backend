import express from "express";
const router = express.Router();
import { book, createOrder, deliver, verifyTranscation } from "../controllers/bookingController";
import { requireAuth } from "../middleware/authMiddleware";

router.post("/", requireAuth, book);

router.post("/paymentlink", requireAuth, createOrder);

router.post("/verifypayment", requireAuth, verifyTranscation);

router.get("/deliver/:bookingId", deliver);

export default router;
