import { Schema } from "mongoose";
import { Request } from "express";

export interface IRequest extends Request {
  user?: IUser | null;
}

export interface UserPayload extends JwtPayload {
  id: string;
}

export interface IBooking {
  user: Schema.Types.ObjectId;
  building: string;
  department: string;
  floor: string;
  room: string;
  date: string;
  paymentMode: string;
  quantity: number;
  paymentId: string;
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  contact: string;
  email: string;
  building: Schema.Types.ObjectId;
  floor: Schema.Types.ObjectId;
  department: Schema.Types.ObjectId;
  room: string;
  otp: number;
  detailsEntered: boolean;
}

export interface IPayment {
  user: Schema.Types.ObjectId;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
