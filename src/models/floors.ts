import { Schema, model } from "mongoose";

const floorScehma = new Schema({
  building: { type: Schema.Types.ObjectId, ref: "building" },
  floor: String,
});

export default model("floor", floorScehma);
