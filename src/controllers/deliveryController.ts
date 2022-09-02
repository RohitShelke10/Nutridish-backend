import { Request, Response } from "express";
import Building from "../models/buildings";
import Department from "../models/departments";
import dotenv from "dotenv";
dotenv.config();

export const getBuildings = async (req: Request, res: Response) => {
  try {
    const buildings = await Building.find();
    res.status(200).json(buildings);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  const building = req.params.building;
  try {
    const departments = await Department.find(
      { building: building },
      { department: 1 }
    );
    res.status(200).json(departments);
  } catch (err) {
    res.status(400).json(err);
  }
};
