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
const { samplePosts } = require('./public/postConst');
const { Post } = require('./public/postConst');
let tempAccounts = []; // Array to store temporary accounts
let posts = []; // Array to store posts

// Concatenate the samplePosts array into the posts array
posts = posts.concat(samplePosts);

console.log(posts); // Output the resulting array of posts


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

app.post('/removeTempAccount', (req, res) => {
  tempAccounts = []; // Empty the tempAccounts array
  console.log('All session accounts removed');
  res.status(200).send('All session accounts removed successfully.');
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

// Route to save post
app.post('/savePost', (req, res) => {
  let { id, title, description, tags, upvotes , downvotes } = req.body;
  let post = { id, title, description, tags, upvotes, downvotes };
  post.upvotes = 0;
  post.downvotes = 0;
  post.id = posts.length;
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
// Route handler for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/MainPage.html');
});

app.get('/sampleAccounts', (req, res) => {
  res.json(sampleAccounts);
});
