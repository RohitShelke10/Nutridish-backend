import express from "express";
const router = express.Router();
import {
  getBuildings,
  getDepartments,
} from "../controllers/deliveryController";

router.get("/buildings", getBuildings);

router.get("/departments/:building", getDepartments);

export default router;
