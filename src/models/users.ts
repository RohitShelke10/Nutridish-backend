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
      required: true,
      unique: true,
      minlength: 13,
      maxlength: 13,
    },
    building: { type: Schema.Types.ObjectId, ref: "building" },
    floor: { type: Schema.Types.ObjectId, ref: "floor" },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
    },
  },
  { timestamps: true }
);

export default model("user", userSchema);
