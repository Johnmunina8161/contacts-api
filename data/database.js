// data/database.js
const { MongoClient } = require('mongodb');

let database; // Singleton for the database connection

/**
 * Initialize MongoDB connection
 * Call this once before starting your server
 */
const initDb = async () => {
  if (database) return database; // Return existing connection if already initialized

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not defined in .env file');
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    database = client.db(); // Use default database from URI
    console.log('✅ Connected to MongoDB');
    return database;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    throw err;
  }
};

/**
 * Get the MongoDB database instance
 * Make sure initDb() has been called first
 */
const getDb = () => {
  if (!database) {
    throw new Error(
      'Database not initialized. Call initDb() before calling getDb().'
    );
  }
  return database;
};

module.exports = { initDb, getDb };
