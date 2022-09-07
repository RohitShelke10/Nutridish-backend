import { Schema, model } from "mongoose";

const departmentScehma = new Schema({
  floor: { type: Schema.Types.ObjectId, ref: "floor" },
  department: String,
});

export default model("department", departmentScehma);
