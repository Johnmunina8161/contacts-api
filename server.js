const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

// importer le router correctement
app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`running on port ${port}`);
});



