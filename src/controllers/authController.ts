import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

const createToken = (id: Schema.Types.ObjectId) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET!);
};

export const handleSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, contact, buildingId, floorId, departmentId } = req.body;

  try {
    const user = await User.create({
      name: name,
      contact: contact,
      building: buildingId,
      floor: floorId,
      department: departmentId,
    });
    const token = createToken(user._id);
    res.status(201).json({
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { contact } = req.body;
  try {
    const user = await User.findOne({ contact: contact });
    if (user && user._id) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true });
      res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      res.status(400).json({ message: "User with this mobile does not exist" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};
