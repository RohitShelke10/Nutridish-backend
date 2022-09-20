import { Schema, model } from "mongoose";
import { IPayment } from "../types/types";

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  payment_id: { type: String, required: true },
  reference_id: { type: String, required: true },
  status: { type: String, required: true },
  amount_paid: { type: Number, required: true },
});

export default model("payment", paymentSchema);
