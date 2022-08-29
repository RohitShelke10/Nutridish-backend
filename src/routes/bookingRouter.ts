import express from "express";
const router = express.Router();
import { book } from "../controllers/bookingController";

router.post("/", book);

export default router;
