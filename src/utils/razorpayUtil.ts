import razorpay from "razorpay";
// import crypto from "crypto";
require("dotenv").config();

export const instance = new razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// export const validatePaymentVerification = (
//   payment_link_id: string,
//   payment_id: string,
//   payment_reference_id: string,
//   payment_status: string,
//   signature: string
// ) => {
//   const generated_signature = crypto
//     .createHmac("sha256", process.env.KEY_SECRET!)
//     .update(
//       payment_link_id +
//         "|" +
//         payment_id +
//         "|" +
//         payment_reference_id +
//         "|" +
//         payment_status
//     )
//     .digest("hex");
//   return generated_signature === signature;
// };
