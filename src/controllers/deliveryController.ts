import { Request, Response } from "express";
import Building from "../models/buildings";
import Department from "../models/departments";
import Floor from "../models/floors";
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

export const getFloors = async (req: Request, res: Response) => {
  const building = req.params.building;
  try {
    const floors = await Floor.find({ building: building }, { floor: 1 }).sort({
      floor: 1,
    });
    res.status(200).json(floors);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  const floor = req.params.floor;
  try {
    const departments = await Department.find(
      { floor: floor },
      { department: 1 }
    );
    res.status(200).json(departments);
  } catch (err) {
    res.status(400).json(err);
  }
};
