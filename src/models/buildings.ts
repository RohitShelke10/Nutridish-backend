import {Schema, model} from "mongoose"

const buildingSchema = new Schema({
    building: String
});

export default model("building", buildingSchema);