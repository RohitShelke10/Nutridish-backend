import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bookingRoutes from "./routes/bookingRouter";

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

app.listen(port, async (): Promise<void> => {
    // connect to google sheets instead
//   try {
//     await connect(process.env.MONGODB_URI!);
//     console.log("Successfully connected to MongoDB");
//   } catch (e) {
//     console.error(e);
//   }
  console.log(`🐵 Server Running at http://localhost:${port}`);
});
