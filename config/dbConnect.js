const mongoose = require("mongoose");

let isConnected = false;

exports.dbConnect = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    console.error("❌ MongoDB connection error:", e.message);
  }
};
