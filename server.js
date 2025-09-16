// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// --- Routes ---
app.use('/api/contacts', require('./routes/contacts'));

// --- Swagger setup ---
const serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for storing and retrieving contacts',
    },
    servers: [{ url: serverUrl }]
  },
  apis: ['./routes/*.js'] // JSDoc comments in routes generate docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Mount Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.send('Contacts API is running. Visit /api-docs for API documentation.');
});

// --- Start server after DB init ---
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database.', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`✅ Connected to MongoDB`);
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📖 Swagger docs available at ${serverUrl}/api-docs`);
    });
  }
});
