const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
  if (database) return callback(null, database);

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client.db('contactsDB'); // ✅ fixed database
      console.log('Connected to MongoDB');
      callback(null, database);
    })
    .catch((err) => {
      console.error('MongoDB connection error', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) throw Error('Database not initialized');
  return database;
};

module.exports = { initDb, getDatabase };
