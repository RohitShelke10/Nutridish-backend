import { Response } from "express";
import { IRequest } from "../types/types";
import User from "../models/users";

export const editProfile = async (req: IRequest, res: Response) => {
  const { name, contact, buildingId, floorId, departmentId, room, isStaff } =
    req.body;
  const id = req.user?._id;

  if (
    name &&
    contact &&
    buildingId &&
    floorId &&
    departmentId &&
    room &&
    isStaff
  ) {
    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: {
          name: name,
          contact: contact,
          building: buildingId,
          floor: floorId,
          department: departmentId,
          room: room,
          detailsEntered: true,
          isStaff: isStaff,
        },
      });
      const updatedUser = await User.findById(user?._id);
      res.status(200).json({
        success: true,
        message: "User details updated",
        data: updatedUser,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Incorrect request params" });
  }
};
