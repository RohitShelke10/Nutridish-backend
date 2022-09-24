import { Response } from "express";
import { IRequest } from "../types/types";
import dotenv from "dotenv";
import Booking from "../models/bookings";
// import axios from "axios";
import otpGenerator from "otp-generator";
import { instance as razorpay } from "../utils/razorpayUtil";
import QRCode from "qrcode";
import { cloud } from "../utils/cloudinaryUtil";
import User from "../models/users";
dotenv.config();

export const createOrder = async (req: IRequest, res: Response) => {
  const { amount, date } = req.body;
  const user = req.user;

  try {
    if (amount && date) {
      let price;
      user?.isStaff
        ? (price = parseInt(process.env.STAFF_PRICE!))
        : (price = parseInt(process.env.STUDENT_PRICE!));
      const result = await razorpay.paymentLink.create({
        upi_link: true,
        amount: amount * price * 100,
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
      await Booking.create({
        user: user!._id,
        date: date,
        paymentMode: "UPI",
        quantity: amount,
        paymentId: result.id,
        paid: false,
        building: user?.building,
        department: user?.department,
        floor: user?.floor,
        room: user?.room,
        price: amount * price,
      });

      res.status(200).json({
        success: true,
        data: {
          payment_url: result.short_url,
          payment_id: result.id,
          reference_id: result.reference_id,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid params",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

export const verifyTranscation = async (req: IRequest, res: Response) => {
  const { paymentId } = req.body;
  const user = req.user;

  try {
    const payment = await razorpay.paymentLink.fetch(paymentId);
    if (payment.payments.length !== 0) {
      if (payment.payments[0].status === "captured") {
        const booking = await Booking.findOneAndUpdate(
          { user: user?._id, paymentId: paymentId },
          {
            $set: {
              paid: true,
            },
          }
        );
        const result = await cloud.uploader.upload(
          await QRCode.toDataURL(
            `${process.env.SERVER_URL}/book/deliver/${booking?._id}`
          ),
          {
            overwrite: true,
            folder: "qrcodes",
            public_id: `${booking?._id}-qr.png`,
          }
        );
        await Booking.findByIdAndUpdate(booking?._id, {
          $set: { qr: result.secure_url },
        });
        res.status(200).json({
          success: true,
          message: "Success",
          data: { booking: booking, qr: result.secure_url },
        });
      } else {
        res.status(200).json({
          success: false,
          failed: true,
          message: "Payment failed, please retry",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        failed: false,
        message: "Payment not made yet",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

export const book = async (req: IRequest, res: Response) => {
  const { date, quantity } = req.body;
  const user = req.user;
  if (date && quantity) {
    try {
      let price;
      user?.isStaff
        ? (price = parseInt(process.env.STAFF_PRICE!))
        : (price = parseInt(process.env.STUDENT_PRICE!));
      const booking = await Booking.create({
        user: user!._id,
        date: date,
        paymentMode: "Pay On Delivery",
        quantity: quantity,
        building: user?.building,
        department: user?.department,
        floor: user?.floor,
        room: user?.room,
        price: quantity * price,
      });

      const result = await cloud.uploader.upload(
        await QRCode.toDataURL(
          `${process.env.SERVER_URL}/book/deliver/${booking._id}`
        ),
        {
          overwrite: true,
          folder: "qrcodes",
          public_id: `${booking._id}-qr.png`,
        }
      );
      await Booking.findByIdAndUpdate(booking._id, {
        $set: { qr: result.secure_url },
      });
      res.status(200).json({
        success: true,
        message: "Success",
        data: { booking: booking, qr: result.secure_url },
      });
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
};

export const deliver = async (req: IRequest, res: Response) => {
  const bookingId = req.params.bookingId;
  try {
    const booking = await Booking.findById(bookingId);
    if (booking) {
      const user = await User.findById(booking.user);
      if (booking.qr) {
        const date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        await Booking.findByIdAndUpdate(bookingId, {
          $set: {
            isDelivered: true,
            deliveredOn: `${date}`,
          },
          $unset: { qr: "" },
        });
        await cloud.uploader.destroy(
          `qrcodes/${booking._id}-qr.png`,
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
          }
        );
        res.send(`Delivered to ${user?.name}`);
      } else {
        res.send(`Already delivered to ${user?.name}`);
      }
    } else {
      res.send("Invalid qr");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
