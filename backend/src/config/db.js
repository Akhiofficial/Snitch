import mongoose from 'mongoose';
import { config } from './config.ts';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
