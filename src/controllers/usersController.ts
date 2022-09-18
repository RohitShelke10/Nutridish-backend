import { Response } from "express";
import { IRequest } from "../types/types";
import User from "../models/users";
import { Schema } from "mongoose";

export const editProfile = async (req: IRequest, res: Response) => {
  const { name, buildingId, floorId, departmentId } = req.body;
  const id = req.user?._id;

  try {
    await User.findByIdAndUpdate(id, {
      $set: {
        name: name,
        building: buildingId,
        floor: floorId,
        department: departmentId,
        detailsEntered: true,
      },
    });
    res.status(200).json({ success: true, message: "User details updated" });
  } catch (err) {
    res.status(400).json(err);
  }
};
