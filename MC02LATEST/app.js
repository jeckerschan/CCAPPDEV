const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON bodies

// Require Account constructor from accountConst.js
const { Account } = require('./public/accountConst');
const { sampleAccounts } = require('./public/accountConst');
let tempAccounts = []; // Array to store temporary accounts
let posts = [];

// Endpoint to receive and save temporary account data
app.post('/saveTempAccount', (req, res) => {
  const { username, password } = req.body;
  tempAccounts.push({ username, password });
  console.log('Saved temporary account:', { username, password });
  res.status(200).send('Temporary account saved successfully.');
});

// Route to send sampleAccounts data
app.get('/sampleAccounts', (req, res) => {
  res.json(sampleAccounts);
});

// Route to add account
app.post('/addAccount', (req, res) => {
  const { username, password } = req.body;
  const newAccount = new Account(username, password); // Use the Account constructor
  sampleAccounts.push(newAccount);
  console.log('New account added:', newAccount.username);
  console.log('Password:', newAccount.password);
  res.sendStatus(200);
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
