import { Schema, model } from "mongoose";

const departmentScehma = new Schema({
  building: { type: Schema.Types.ObjectId, ref: "building" },
  department: String,
});

export default model("department", departmentScehma);
