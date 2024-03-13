const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON bodies

let tempAccounts = []; // Array to store temporary accounts

// Endpoint to receive and save temporary account data
app.post('/saveTempAccount', (req, res) => {
  const { username, password } = req.body;
  tempAccounts.push({ username, password });
  console.log('Saved temporary account:', { username, password });
  res.status(200).send('Temporary account saved successfully.');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
