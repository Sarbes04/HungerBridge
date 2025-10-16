// config/db.js
import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const uri = "mongodb+srv://sarvesh221160_db_user:0pMXmbHCt6XJmbhj@cluster0.fcrgemb.mongodb.net/byteverse?retryWrites=true&w=majority&appName=Cluster0";
    
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