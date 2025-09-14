const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'users';

// Helper to send JSON with optional pretty-print
const sendJson = (res, data) => {
  res.setHeader('Content-Type', 'application/json');

  // Pretty-print only in development
  if (process.env.NODE_ENV === 'development') {
    res.status(200).send(JSON.stringify(data, null, 2));
  } else {
    res.status(200).json(data);
  }
};

// Get all contacts
const getAll = async (req, res) => {
  try {
    const db = mongodb.getDatabase();
    const result = await db.collection(COLLECTION_NAME).find().toArray();
    sendJson(res, result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching contacts');
  }
};

// Get a single contact by ID
const getSingle = async (req, res) => {
  try {
    const db = mongodb.getDatabase();
    const contactId = new ObjectId(req.params.id);
    const contact = await db.collection(COLLECTION_NAME).findOne({ _id: contactId });

    if (!contact) {
      return res.status(404).send('Contact not found');
    }

    sendJson(res, contact);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching contact');
  }
};

module.exports = {
  getAll,
  getSingle
};

