const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json()); 

const { connectToMongo, getDb, accountsCollectionPromise, postsCollectionPromise } = require('./db/conn.js');
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


//console.log("connected to MongoDB server")
initializeCollections();
const db = getDb();
starterCollections(db);

})


async function starterCollections(db) {
  try {
    
    const collections = await db.listCollections().toArray();
    //const { username, password } = account;
    
    const accountsCollectionExists = collections.some(collection => collection.name === 'accounts');
    const postsCollectionExists = collections.some(collection => collection.name === 'posts');

    if (accountsCollectionExists) {
      const accountsCollection = db.collection('accounts');
      const accounts = await accountsCollection.find({}).toArray();

      sampleAccounts.length = 0; // Clear existing sampleAccounts array
      accounts.forEach(account => {
       
        sampleAccounts.push(new Account(account.username, account.password, account.accountID));
        console.log(`Username: ${account.username}, ID: ${account.accountID}`);
      });

      console.log("Sample accounts updated successfully");
      
    } else {
      console.log("Collection 'accounts' does not exist, skipping population of sampleAccounts");
    }
    if (!accountsCollectionExists) {
      
      const accountsCollection = db.collection('accounts');

      
      const hashedSampleAccounts = await Promise.all(sampleAccounts.map(async account => {
        const hashedPassword = await bcrypt.hash(account.password, 14); 
        return { ...account, password: hashedPassword };
      }));

      await accountsCollection.insertMany(hashedSampleAccounts);
      console.log("Sample accounts inserted successfully");
    } else {
      console.log("Collection 'accounts' already exists, skipping insertion");
    }

    if (!postsCollectionExists) {
      
      const postsCollection = db.collection('posts');
      await postsCollection.insertMany(samplePosts);
      console.log("Sample posts inserted successfully");
    } else {
      console.log("Collection 'posts' already exists, skipping insertion");
    }

  } catch (err) {
    console.error("Failed to create collections or insert sample data:", err);
    throw err;
  }
}

async function initializeCollections() {
  try {
    const db = await getDb(); 
    await starterCollections(db); 
  } catch (err) {
    console.error("Error initializing collections:", err);
    process.exit(1); 
  }
}


initializeCollections();

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
app.post('/addAccount', async (req, res) => {
  const { username, password } = req.body;
  const accountID = generateAccountID(); // Generate accountID

  try {
      const hashedPassword = await bcrypt.hash(password, 14); // Hash the password
      const db = await getDb(); // Get the database object
      const result = await db.collection('accounts').insertOne({ username, password: hashedPassword, accountID });
   
      sampleAccounts.push(new Account(username, hashedPassword, accountID));
      console.log('New account added:', { username, password: hashedPassword, accountID });
      res.sendStatus(200);
  } catch (err) {
      console.error('Error adding account:', err);
      res.status(500).send('Failed to add account');
  }
});
app.post('/saveTempAccount', (req, res) => {
  const { username, password, accountID } = req.body;

  console.log('Received data:', { username, password, accountID });
  // Assuming tempAccounts is an array defined in the global scope
  tempAccounts.push({ username, password, accountID });

  // Log the saved temporary account
  console.log('Temporary account saved successfully:', { username, password, accountID });

  // Send a success response
  res.sendStatus(200);
});

let nextAccountID = 6; // Starting accountID
function generateAccountID() {
    const accountID = nextAccountID.toString().padStart(4, '0');
    nextAccountID++;
    return accountID;
}
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
// Route handler for validateLogin endpoint
app.post('/validateLogin', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received request body:', req.body); 
  try {
      // Hash the password entered by the user
     
      // Authenticate the login credentials
      const isAuthenticated = await authenticateLogin(username, password, db);

      if (isAuthenticated) {
          // Login successful
          res.status(200).json({ message: "Login successful" });
      } else {
          // Login failed
          res.status(401).json({ message: "Invalid username or password" });
      }
  } catch (error) {
      // Internal server error
      console.error("Error handling login request:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

async function authenticateLogin(username, password, db) {
  try {
      console.log('Received username:', username); // Log received username
      console.log('Received password:', password); // Log received password

     // const accountsCollection = await accountsCollectionPromise;

      // Find the account with the given username
      const account = await db.collection('accounts').findOne({ username });
      console.log('Found account - Username:', account.username, 'Account ID:', account.accountID);
      if (account) {
        const isPasswordMatch = await bcrypt.compare(password, account.password);
        return isPasswordMatch;
      } else {
        console.error("Account not found");
        return false;
      }
  } catch (error) {
      console.error("Error authenticating login:", error);
      throw error;
  }
}
