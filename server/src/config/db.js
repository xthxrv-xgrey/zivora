import mongoose from "mongoose";
import env from "./env.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDatabase;
