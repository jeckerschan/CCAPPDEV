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
  let { id, title, description, tags, upvotes , downvotes, comments } = req.body;
  let post = { id, title, description, tags, upvotes, downvotes, comments };
  post.upvotes = 0;
  post.downvotes = 0;
  post.id = posts.length;
  post.comments = [];
  posts.push(post);
  console.log('Post saved:', post);
  res.sendStatus(200);
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

// route to update number of upvotes
app.post('/updateUpvote', (req, res) => {
  const postId = req.body.postId; // Assuming the client sends the entire post object in the request body
  
  posts[postId].upvotes++;
  res.json({ success: true, message: 'Upvote count updated successfully' });

});

// route to update number of downvotes
app.post('/updateDownvote', (req, res) => {
  const postId = req.body.postId; // Assuming the client sends the entire post object in the request body
  
  posts[postId].downvotes++;
  res.json({ success: true, message: 'Downvote count updated successfully' });

});

app.post('/updateComment', (req, res) => {
  const { postId, comment } = req.body;

  posts[postId].comments.push(comment);
  res.json({ success: true, message: 'Comment added successfully' });

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
// Route handler for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/MainPage.html');
});


