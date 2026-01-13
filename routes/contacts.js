const express = require('express');
const router = express.Router();
const db = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const database = db.getDatabase();
    const contacts = await database.collection('users').find().toArray();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET contact by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  // Validate the ID first
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid contact ID format' });
  }

  try {
    const database = db.getDatabase();
    const contact = await database
      .collection('users')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

module.exports = router;
