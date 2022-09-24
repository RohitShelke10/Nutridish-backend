import { Schema, model } from "mongoose";
import { IBooking } from "../types/types";

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    building: { type: Schema.Types.ObjectId, ref: "buildings" },
    department: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "departments",
    },
    floor: { type: Schema.Types.ObjectId, ref: "floors" },
    room: { type: String },
    date: { type: String, required: true },
    paymentMode: {
      type: String,
      required: true,
      enum: ["UPI", "Pay On Delivery"],
    },
    quantity: { type: Number, required: true },
    paymentId: { type: String },
    isDelivered: { type: Boolean, default: false },
    qr: String,
    deliveredOn: String,
    paid: Boolean,
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("booking", bookingSchema);
