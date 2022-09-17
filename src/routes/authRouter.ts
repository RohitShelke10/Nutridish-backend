import express from "express";
import {
  sendVerificationEmail,
  handleSignIn,
} from "../controllers/authController";
const router = express.Router();

router.post("/signin", handleSignIn);

router.post("/sendMail", sendVerificationEmail);

export default router;
