import express from "express";
import {
  editProfile
} from "../controllers/usersController";
const router = express.Router();

router.put("/", editProfile);

export default router;
