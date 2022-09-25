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
  try {
    await api.sendTransacEmail(sendSmtpEmail);
    const user = await User.findOne({ email: email });
    if (!user) {
      await User.create({ email: email, otp: otp });
    } else {
      await User.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const handleSignIn = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email }).populate([
      "building",
      "floor",
      "department",
    ]);
    if (user) {
      if (user.otp === parseInt(otp)) {
        const updatedUser = await User.findByIdAndUpdate(user._id, {
          $unset: { otp: "" },
        }).select({ otp: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        const token = createToken(user._id);
        res.status(201).json({
          success: true,
          user: updatedUser,
          token: token,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Incorrect OTP entered" });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
