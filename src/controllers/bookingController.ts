import { Response } from "express";
import { IRequest } from "../types/types";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";
import fs from "fs";
import Booking from "../models/bookings";
import Payment from "../models/payments";
import axios from "axios";
import otpGenerator from "otp-generator";
import { instance as razorpay } from "../utils/razorpayUtil";
dotenv.config();

export const createOrder = async (req: IRequest, res: Response) => {
  const { amount } = req.body;

  try {
    const result = await razorpay.paymentLink.create({
      upi_link: true,
      amount: amount * 100,
      currency: "INR",
      description: "Nutri-Dish",
      reference_id: otpGenerator.generate(10, {
        digits: true,
        specialChars: false,
      }),
      expire_by: Date.now() + 300000,
      customer: {
        name: req.user!.name,
        email: req.user!.email,
        contact: req.user!.contact,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        payment_url: result.short_url,
        payment_id: result.id,
        reference_id: result.reference_id,
      },
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const book = async (req: IRequest, res: Response) => {
  const {
    building,
    department,
    floor,
    room,
    date,
    paymentMode,
    quantity,
    paymentId,
  } = req.body;
  const user = req.user;
  if (
    building &&
    department &&
    floor &&
    room &&
    date &&
    paymentMode &&
    quantity &&
    paymentId
  ) {
    const doc = new GoogleSpreadsheet(process.env.sheetID);
    const file = fs.readFileSync("./info.json");

    try {
      const payment = await razorpay.paymentLink.fetch(paymentId);
      if (payment.payments.length !== 0) {
        if (payment.payments[0].status === "captured") {
          await Booking.create({
            user: user!._id,
            building: building,
            department: department,
            floor: floor,
            room: room,
            date: date,
            paymentMode: paymentMode,
            quantity: quantity,
            paymentId: payment.payments[0].payment_id,
          });
          await doc.useServiceAccountAuth({
            client_email: process.env.clientEmail!,
            private_key: JSON.parse(file.toString()).private_key,
          });
          await doc.loadInfo();
          const sheet = doc.sheetsByTitle[process.env.sheetTitle!];
          await sheet.addRow({
            name: user!.name,
            contact: user!.contact,
            building: building,
            department: department,
            floor: floor,
            room: room,
            date: date,
            paymentMode: paymentMode,
            quantity: quantity,
          });
          // if (user!.contact) {
          //   await axios.post(
          //     process.env.WA_URL!.toString(),
          //     {
          //       messaging_product: "whatsapp",
          //       to: user!.contact,
          //       type: "template",
          //       template: {
          //         name: "order_confirm",
          //         language: {
          //           code: "en_GB",
          //         },
          //         components: [
          //           {
          //             type: "header",
          //             parameters: [
          //               {
          //                 type: "image",
          //                 image: {
          //                   link: "https://res.cloudinary.com/dpp7elupy/image/upload/v1662890116/nutridish/Photo_from_%E0%A4%B5%E0%A5%87%E0%A4%A6_pnbwqa.jpg",
          //                 },
          //               },
          //             ],
          //           },
          //         ],
          //       },
          //     },
          //     {
          //       headers: {
          //         "Content-Type": "application/json",
          //         Authorization: `Bearer ${process.env.WA_TOKEN}`,
          //       },
          //     }
          //   );
          // }
          const receipt = await Payment.create({
            user: user!._id,
            payment_id: payment.payments[0].payment_id,
            reference_id: payment.reference_id,
            status: payment.payments[0].status,
            amount_paid: payment.amount_paid / 100,
          });
          res
            .status(200)
            .json({ sucess: true, message: "Success", data: receipt });
        } else {
          const receipt = await Payment.create({
            user: user!._id,
            payment_id: payment.payments[0].payment_id,
            reference_id: payment.reference_id,
            status: payment.payments[0].status,
            amount_paid: payment.amount_paid / 100,
          });
          res.status(400).json({
            success: false,
            failed: true,
            message: "Payment failed, please retry",
            data: receipt,
          });
        }
      } else {
        res.status(400).json({
          success: false,
          failed: false,
          message: "Payment not made yet",
        });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
};
