import { Schema, model } from "mongoose";
import { IBooking } from "../types/types";

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    building: { type: String, required: true },
    department: { type: String, required: true },
    floor: { type: String, required: true },
    room: { type: String, required: true },
    date: { type: String, required: true },
    paymentMode: { type: String, required: true },
    quantity: { type: Number, required: true },
    paymentId: { type: String, required: true },
    isDelivered: { type: Boolean, default: false },
    qr: String
  },
  { timestamps: true }
);

export default model("booking", bookingSchema);
