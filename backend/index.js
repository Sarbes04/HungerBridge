import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import donorRouter from "./routes/donorRoutes.js";
import receiverRouter from "./routes/receiverRoutes.js";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/donor", donorRouter);
app.use("/api/receiver", receiverRouter);
app.listen(PORT, () => {
  console.log(`Serving on port :${PORT}`);
  connectDb();
});


export const connectDb = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};