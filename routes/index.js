const router = require('express').Router();
const contactsController = require('../controllers/contacts');

// Root route → show all contacts
router.get('/', contactsController.getAll);

// Contacts route
router.use('/contacts', require('./contacts'));

module.exports = router;
