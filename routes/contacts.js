const express = require('express');
const router = express.Router();

// Import contacts controller
const contactsController = require('../controllers/contacts');

// GET all contacts
router.get('/', contactsController.getAll);

// GET a single contact by ID
router.get('/:id', contactsController.getSingle);

module.exports = router;
