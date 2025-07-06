const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectWithRetry = async (retries = 3, delay = 1000) => {
  while (retries > 0) {
    try {
      return await mongoose.connect(process.env.DB_URL, {
        bufferCommands: false,
      });
    } catch (err) {
      retries--;
      if (retries === 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

exports.dbConnect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connectWithRetry(); 
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
