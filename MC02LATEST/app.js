const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON bodies

let tempAccounts = []; // Array to store temporary accounts

let posts = [];

// Endpoint to receive and save temporary account data
app.post('/saveTempAccount', (req, res) => {
  const { username, password } = req.body;
  tempAccounts.push({ username, password });
  console.log('Saved temporary account:', { username, password });
  res.status(200).send('Temporary account saved successfully.');
});

// Route to save post
app.post('/savePost', (req, res) => {
  const { title, description, tags } = req.body;
  const post = { title, description, tags };
  posts.push(post);
  console.log('Post saved:', post);
  res.sendStatus(200);
});


app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
