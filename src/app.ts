import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "mongoose";
import bookingRoutes from "./routes/bookingRouter";
import deliveryRoutes from "./routes/deliveryRouter";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Instead of body parser
app.use(express.json());

//Including Routers

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Nutriplate");
});

app.use("/book", bookingRoutes);
app.use("/delivery", deliveryRoutes);

app.listen(port, async (): Promise<void> => {
  try {
    await connect(process.env.MONGODB_URI!);
    console.log("Successfully connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
  console.log(`Server Running at http://localhost:${port}`);
});
