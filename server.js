// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// basic middleware
app.use(express.json());

// Mount API routes
app.use('/api/contacts', require('./routes/contacts'));

// --- Swagger setup ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for storing and retrieving contacts',
    },
    servers: [
      { url: process.env.SWAGGER_SERVER_URL || `http://localhost:${port}` }
    ]
  },
  apis: ['./routes/*.js'] // use JSDoc in routes for paths (we also register explicit spec below)
};

// If you want to generate docs from code comments use swaggerJsdoc(swaggerOptions).
// We'll also create a small manual spec to ensure examples are present.
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Mount swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root
app.get('/', (req, res) => {
  res.send('Contacts API is running. Visit /api-docs for API documentation.');
});

// Start server after DB init
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database.', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});




