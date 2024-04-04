const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json()); 

const { connectToMongo, getDb } = require('./db/conn.js');
const { Account } = require('./public/accountConst');
const { sampleAccounts } = require('./public/accountConst');
const { samplePosts } = require('./public/postConst');
const { Post } = require('./public/postConst');
let tempAccounts = []; 
let posts = []; 
let userProfile = {
  description: "I have no description" // Default description
};

posts = posts.concat(samplePosts);

console.log(posts);


connectToMongo((err) =>{
if (err) {
  console.log("error occured:");
  console.error(err);
  process.exit();
}


console.log("connected to MongoDB server")

const db = getDb();


})

app.post('/saveTempAccount', (req, res) => {
  const { username, password, accountID } = req.body;
  tempAccounts.push({ username, password, accountID });
  console.log('Saved temporary account:', { username, password, accountID });
  res.status(200).send('Temporary account saved successfully.');
});


app.get('/sampleAccounts', (req, res) => {
  res.json(sampleAccounts);
});

app.get('/tempAccounts', (req, res) => {
  res.json(tempAccounts);
});

app.post('/removeTempAccount', (req, res) => {
  tempAccounts = []; 
  console.log('All session accounts removed');
  res.status(200).send('All session accounts removed successfully.');
});

// Route to add account
app.post('/addAccount', (req, res) => {
  const { username, password } = req.body;
  const newAccount = new Account(username, password); 
  sampleAccounts.push(newAccount);
  console.log('New account added:', newAccount.username);
  console.log('Password:', newAccount.password);
  res.sendStatus(200);
});

// Route to save post
app.post('/savePost', (req, res) => {
  let { id, title, description, tags, upvotes , downvotes, comments, accountID } = req.body;
  let post = { id, title, description, tags, upvotes, downvotes, comments, accountID };
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
  let { postId, upvotes } = req.body;
  
  posts[postId].upvotes = upvotes;
  res.json({ success: true, message: 'Upvote count updated successfully' });

});

// route to update number of downvotes
app.post('/updateDownvote', (req, res) => {
  let { postId, downvotes } = req.body; 
  
  posts[postId].downvotes = downvotes;
  res.json({ success: true, message: 'Downvote count updated successfully' });

});

app.post('/updateComment', (req, res) => {
  const { postId, comment } = req.body;

  posts[postId].comments.push(comment);
  res.json({ success: true, message: 'Comment added successfully: ' + posts[postId].comments });

});

// Route to fetch username
app.get('/getUsername', (req, res) => {
  if (tempAccounts.length > 0) {
      res.json({ username: tempAccounts[0].username });
  } else {
      res.json({ username: null });
  }
});

// Route to save description
app.post('/saveDescription', (req, res) => {
  const { description } = req.body;
  userProfile.description = description;
  console.log('Description received:', description);
  res.sendStatus(200);
});


app.get('/getUserProfile', (req, res) => {
  res.json(userProfile);
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
// Route handler for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Login.html');
});

app.get('/sampleAccounts', (req, res) => {
  res.json(sampleAccounts);
});
