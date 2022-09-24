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
  building: Schema.Types.ObjectId;
  department: Schema.Types.ObjectId;
  floor: Schema.Types.ObjectId;
  room: string;
  date: string;
  paymentMode: string;
  quantity: number;
  price: number;
  paymentId: string;
  isDelivered: boolean;
  qr: string;
  deliveredOn: string;
  paid: boolean;
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
  isStaff: boolean;
}

export interface IPayment {
  user: Schema.Types.ObjectId;
  payment_id: string;
  reference_id: string;
  status: string;
  amount_paid: number;
}

export interface ISpreadSheetCredentials {
  auth: GoogleAuth<JSONClient>;
  googleSheetsInstance: sheets_v4.Sheets;
}
