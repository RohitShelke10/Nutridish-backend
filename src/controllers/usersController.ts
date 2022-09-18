import { Response } from "express";
import { IRequest } from "../types/types";
import User from "../models/users";
import { Schema } from "mongoose";

export const editProfile = async (req: IRequest, res: Response) => {
  const { name, contact, buildingId, floorId, departmentId } = req.body;
  const id = req.user?._id;

  if (name && contact && buildingId && floorId && departmentId) {
    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: {
          name: name,
          contact: contact,
          building: buildingId,
          floor: floorId,
          department: departmentId,
          detailsEntered: true,
        },
      });
      res
        .status(200)
        .json({ success: true, message: "User details updated", data: user });
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Incorrect request params" });
  }
};
