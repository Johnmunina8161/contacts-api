const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const db = require('../data/database');

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await db.getDb().collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET contact by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid contact ID format' });
  }

  try {
    const contact = await db.getDb()
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// POST (create) new contact
router.post('/', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName, and email are required' });
  }

  try {
    const result = await db.getDb().collection('contacts').insertOne({
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || '',
      birthday: birthday || ''
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// PUT (update) contact
router.put('/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid contact ID format' });
  }

  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName, and email are required' });
  }

  try {
    const result = await db.getDb()
      .collection('contacts')
      .replaceOne(
        { _id: new ObjectId(id) },
        { firstName, lastName, email, favoriteColor: favoriteColor || '', birthday: birthday || '' }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send(); // no content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid contact ID format' });
  }

  try {
    const result = await db.getDb()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
