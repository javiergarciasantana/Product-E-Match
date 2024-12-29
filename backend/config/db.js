import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Debugging the URI
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('Error: MONGO_URI is not defined in the .env file');
      process.exit(1);  // Exit if the URI is not defined
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
