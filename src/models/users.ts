import { Schema, model } from "mongoose";
import { IUser } from "../types/types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    building: { type: Schema.Types.ObjectId, ref: "building", required: true },
    floor: { type: Schema.Types.ObjectId, ref: "floor", required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("user", userSchema);
