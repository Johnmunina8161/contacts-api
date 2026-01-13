const express = require('express');
const cors = require('cors');
const db = require('./data/database');
const contactsRoutes = require('./routes/contacts');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/contacts', contactsRoutes);

// Root route → redirect to contacts
app.get('/', (req, res) => {
  res.redirect('/contacts');
});

// Initialize DB and start server
db.initDb((err) => {
  if (err) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

