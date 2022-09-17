import express from "express";
import { handleLogin, handleSignUp, sendVerificationEmail } from "../controllers/authController";
const router = express.Router();

router.post("/signup", handleSignUp);

router.post("/login", handleLogin);

router.post("/sendMail", sendVerificationEmail);

export default router;
