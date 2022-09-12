import { Schema, model } from "mongoose";
import { IBooking } from "../types/types";

const bookingSchema = new Schema<IBooking>({
  name: { type: String, required: true },
  contact: { type: String, required: true, maxlength: 10, minlength: 10 },
  building: { type: String, required: true },
  department: { type: String, required: true },
  floor: { type: Number, required: true },
  room: { type: Number, required: true },
  date: { type: String, required: true },
  paymentMode: { type: String, required: true, enum: ["pay on delivery", "upi"] },
});

export default model("booking", bookingSchema);
