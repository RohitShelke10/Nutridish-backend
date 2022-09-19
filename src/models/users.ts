import { Schema, model } from "mongoose";
import { IUser } from "../types/types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    otp: Number,
    detailsEntered: { type: Boolean, default: false },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      minlength: 13,
      maxlength: 13,
      required: true,
      unique: true,
    },
    building: { type: Schema.Types.ObjectId, ref: "building" },
    floor: { type: Schema.Types.ObjectId, ref: "floor" },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
    },
    room: String,
  },
  { timestamps: true }
);

export default model("user", userSchema);
