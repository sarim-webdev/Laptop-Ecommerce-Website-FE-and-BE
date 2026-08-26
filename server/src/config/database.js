import mongoose from "mongoose";
import env from "./environment.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongodbUri);

    console.log(
      `DB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);

    process.exit(1);
  }
};

export default connectDB;