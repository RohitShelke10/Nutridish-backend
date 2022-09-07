import express from "express";
const router = express.Router();
import {
  getBuildings,
  getDepartments,
  getFloors,
} from "../controllers/deliveryController";

router.get("/buildings", getBuildings);

router.get("/floors/:building", getFloors);

router.get("/departments/:floor", getDepartments);

export default router;
