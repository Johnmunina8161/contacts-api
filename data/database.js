// data/database.js
const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }

  if (!process.env.MONGODB_URL) {
    return callback(new Error('Missing MONGODB_URL environment variable'));
  }

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client.db(); // store the database object
      console.log('Connected to MongoDB');
      callback(null, database);
    })
    .catch((err) => {
      console.error('MongoDB connection error', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};

