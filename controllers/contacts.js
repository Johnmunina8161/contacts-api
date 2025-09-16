// controllers/contacts.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'contacts';

// Helper to send JSON with optional pretty-print
const sendJson = (res, data, status = 200) => {
  res.setHeader('Content-Type', 'application/json');
  if (process.env.NODE_ENV === 'development') {
    res.status(status).send(JSON.stringify(data, null, 2));
  } else {
    res.status(status).json(data);
  }
};

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDatabase();
    const docs = await db.collection(COLLECTION_NAME).find().toArray();
    sendJson(res, docs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching contacts');
  }
};

const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Invalid id');
    }
    const db = mongodb.getDatabase();
    const contact = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).send('Contact not found');
    sendJson(res, contact);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching contact');
  }
};

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // All fields required
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).send('All fields are required: firstName, lastName, email, favoriteColor, birthday');
    }

    const db = mongodb.getDatabase();

    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newContact);
    // return the new id in response body
    res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating contact');
  }
};

const updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id');

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // All fields required for update per assignment (if you want partial updates, change this)
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).send('All fields are required: firstName, lastName, email, favoriteColor, birthday');
    }

    const db = mongodb.getDatabase();

    const updateDoc = {
      $set: {
        firstName,
        lastName,
        email,
        favoriteColor,
        birthday
      }
    };

    const result = await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, updateDoc);

    if (result.matchedCount === 0) return res.status(404).send('Contact not found');

    // 204 No Content usually indicates success without body
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating contact');
  }
};

const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id');

    const db = mongodb.getDatabase();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return res.status(404).send('Contact not found');

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting contact');
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
