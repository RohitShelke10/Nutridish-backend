import { Schema, model } from "mongoose";

const departmentSchema = new Schema({
  floor: { type: Schema.Types.ObjectId, ref: "floor" },
  department: String,
});

export default model("department", departmentSchema);
