import { Schema, model } from "mongoose";
import { IUser } from "../types/types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    contact: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
      unique: true,
    },
    building: { type: Schema.Types.ObjectId, ref: "buildings", required: true },
    floor: { type: Schema.Types.ObjectId, ref: "floors", required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("user", userSchema);
