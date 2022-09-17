import { Response } from "express";
import { IRequest } from "../types/types";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";
import fs from "fs";
import Booking from "../models/bookings";
import User from "../models/users";
dotenv.config();

export const book = async (req: IRequest, res: Response) => {
  const { building, department, floor, room, date, paymentMode, quantity } =
    req.body;
  const userId = req.user?._id;
  if (
    building &&
    department &&
    floor &&
    room &&
    date &&
    paymentMode &&
    quantity
  ) {
    const doc = new GoogleSpreadsheet(process.env.sheetID);
    const file = fs.readFileSync("./info.json");

    try {
      const user = await User.findById(userId);
      if (user) {
        await Booking.create({
          user: userId,
          building: building,
          department: department,
          floor: floor,
          room: room,
          date: date,
          paymentMode: paymentMode,
          quantity: quantity,
        });
        await doc.useServiceAccountAuth({
          client_email: process.env.clientEmail!,
          private_key: JSON.parse(file.toString()).private_key,
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle[process.env.sheetTitle!];
        await sheet.addRow({
          user: user.name,
          building: building,
          department: department,
          floor: floor,
          room: room,
          date: date,
          paymentMode: paymentMode,
          quantity: quantity,
        });
        res.status(200).json({ message: "Success" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
};
