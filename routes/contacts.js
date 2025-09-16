// routes/contacts.js
const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

/**
 * @openapi
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         favoriteColor:
 *           type: string
 *         birthday:
 *           type: string
 */

/**
 * @openapi
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get('/', contactsController.getAll);

/**
 * @openapi
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Contact object
 */
router.get('/:id', contactsController.getSingle);

/**
 * @openapi
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Created; returns the new contact id
 */
router.post('/', contactsController.createContact);

/**
 * @openapi
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       204:
 *         description: Update successful (No Content)
 */
router.put('/:id', contactsController.updateContact);

/**
 * @openapi
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Delete successful (No Content)
 */
router.delete('/:id', contactsController.deleteContact);

module.exports = router;

