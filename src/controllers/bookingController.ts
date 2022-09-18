import { Response } from "express";
import { IRequest } from "../types/types";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";
import fs from "fs";
import Booking from "../models/bookings";
import User from "../models/users";
import axios from "axios";
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
        if (user.contact) {
          await axios.post(
            process.env.WA_URL!.toString(),
            {
              messaging_product: "whatsapp",
              to: user.contact,
              type: "template",
              template: {
                name: "order_confirm",
                language: {
                  code: "en_GB",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      {
                        type: "image",
                        image: {
                          link: "https://res.cloudinary.com/dpp7elupy/image/upload/v1662890116/nutridish/Photo_from_%E0%A4%B5%E0%A5%87%E0%A4%A6_pnbwqa.jpg",
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.WA_TOKEN}`,
              },
            }
          );
        }
        res.status(200).json({ message: "Success" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
};
