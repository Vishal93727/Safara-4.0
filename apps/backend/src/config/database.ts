

// import mongoose from 'mongoose';

// export const connectDatabase = async (): Promise<void> => {
//   try {
//     const mongoURI = process.env.MMONGODB_URI || 'mongodb+srv://rampyaremourya5:QqVCrsKAq22V6YGo@cluster0.mwcqxhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
//     await mongoose.connect(mongoURI);
    
//     console.log('✅ MongoDB connected successfully');
//     console.log(`📊 Database: ${mongoose.connection.name}`);
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️  MongoDB disconnected');
// });

// mongoose.connection.on('error', (error) => {
//   console.error('❌ MongoDB error:', error);
// });


import mongoose from "mongoose";

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    console.log("⚠️ MongoDB already connected. Skipping new connection.");
    return;
  }

  try {
    const mongoURI =
      process.env.MMONGODB_URI ||
      'mongodb+srv://rampyaremourya5:QqVCrsKAq22V6YGo@cluster0.mwcqxhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    const db = await mongoose.connect(mongoURI);

    isConnected = db.connection.readyState === 1;

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
