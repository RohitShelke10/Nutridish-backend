import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import api from "../utils/emailUtil";
var SibApiV3Sdk = require("sib-api-v3-sdk");
import otpGenerator from "otp-generator";

const createToken = (id: Schema.Types.ObjectId) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET!);
};

export const sendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  sendSmtpEmail = {
    sender: { email: "startup.mcoe@gmail.com" },
    to: [
      {
        email: email,
      },
    ],
    subject: "Email Verification",
    textContent: `Your OTP for email verification is ${otp}`,
  };
  await api.sendTransacEmail(sendSmtpEmail);
  res.status(200).json(otp);
  try {
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const handleSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, buildingId, floorId, departmentId } = req.body;

  try {
    const user = await User.create({
      name: name,
      email: email,
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
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user && user._id) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true });
      res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      res.status(400).json({ message: "User with this email does not exist" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};
