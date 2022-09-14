import { Schema, model } from "mongoose";

const floorSchema = new Schema({
  building: { type: Schema.Types.ObjectId, ref: "building" },
  floor: String,
});

export default model("floor", floorSchema);
