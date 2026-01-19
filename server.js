const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const db = require('./data/database');
const contactsRoutes = require('./routes/contacts');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/contacts', contactsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const PORT = process.env.PORT || 3000;

// ✅ START SERVER (ASYNC – CORRECT)
const startServer = async () => {
  try {
    await db.initDb(); // IMPORTANT
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

startServer();
