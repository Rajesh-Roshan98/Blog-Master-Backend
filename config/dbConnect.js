const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

exports.dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.DB_URL, {
      bufferCommands: false, 
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected');
  } catch (err) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }

  return cached.conn;
};
