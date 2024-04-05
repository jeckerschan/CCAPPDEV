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

const { connectToMongo, getDb} = require('./db/conn.js');
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



initializeCollections();
const db = getDb();
starterCollections(db);

})


async function starterCollections(db) {
  try {
    
    const collections = await db.listCollections().toArray();
   
    
    const accountsCollectionExists = collections.some(collection => collection.name === 'accounts');
    const postsCollectionExists = collections.some(collection => collection.name === 'posts');

    if (accountsCollectionExists) {
      const accountsCollection = db.collection('accounts');
      const accounts = await accountsCollection.find({}).toArray();

      sampleAccounts.length = 0; 
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
  const accountID =  await generateAccountID(); 

  try {
      const hashedPassword = await bcrypt.hash(password, 14); 
      const db = await getDb(); 
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
  
  tempAccounts.push({ username, password, accountID });

  
  console.log('Temporary account saved successfully:', { username, password, accountID });

  
  res.sendStatus(200);
});

async function generateAccountID() {
  try {
      const db = await getDb();
      const accountsCollection = db.collection('accounts');

    
      const highestAccount = await accountsCollection.find().sort({ accountID: -1 }).limit(1).toArray();

      if (highestAccount.length === 0) {
         
          return '0001';
      } else {
          
          const highestAccountID = parseInt(highestAccount[0].accountID);
          const nextAccountID = highestAccountID + 1;

          
          const paddedAccountID = nextAccountID.toString().padStart(4, '0');
          return paddedAccountID;
      }
  } catch (error) {
      console.error('Error generating account ID:', error);
      throw error;
  }
}

// Route to save post
app.post('/savePost', async (req, res) => {
  let { id, title, description, tags, upvotes , downvotes, comments, accountID } = req.body;
  let post = { id, title, description, tags, upvotes, downvotes, comments, accountID };
  post.upvotes = 0;
  post.downvotes = 0;
  post.id = posts.length;
  post.comments = [];
  posts.push(post);
  console.log('Post saved:', post);
  

  try {
    const db = await getDb();
    await db.collection('posts').insertOne(post);

    console.log('Post saved:', post);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ success: false, message: 'Failed to save post' });
  }
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

// route to update number of upvotes
app.post('/updateUpvote', async (req, res) => {
  let { postId, upvotes } = req.body;
  
  posts[postId].upvotes = upvotes;

  try {
    const db = await getDb();
    await db.collection('posts').updateOne(
      { id: postId },
      { $set: { upvotes: upvotes } }
    );
    
    res.json({ success: true, message: 'Upvote count updated successfully' });
  } catch (error) {
    console.error('Error updating upvote count:', error);
    res.status(500).json({ success: false, message: 'Failed to update upvote count' });
  }
 

});

// route to update number of downvotes
app.post('/updateDownvote', async (req, res) => {
  let { postId, downvotes } = req.body; 
  
  posts[postId].downvotes = downvotes;
  try {
    const db = await getDb();
    await db.collection('posts').updateOne(
      { id: postId },
      { $set: { downvotes: downvotes } }
    );
    
    res.json({ success: true, message: 'Downvote count updated successfully' });
  } catch (error) {
    console.error('Error updating downvote count:', error);
    res.status(500).json({ success: false, message: 'Failed to update downvote count' });
  }


 

});

app.post('/updateComment', async (req, res) => {
  const { postId, comment } = req.body;

  posts[postId].comments.push(comment);

  try {
    const db = await getDb();
    await db.collection('posts').updateOne(
      { id: postId },
      { $push: { comments: comment } }
    );

    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, message: 'Failed to update comment' });
  }
  

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
     
      const db = await getDb();
   
      const isAuthenticated = await authenticateLogin(username, password, db);

      if (isAuthenticated) {
        
          res.status(200).json({ message: "Login successful" });
      } else {
          // Login failed
          res.status(401).json({ message: "Invalid username or password" });
      }
  } catch (error) {
      
      console.error("Error handling login request:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

async function authenticateLogin(username, password, db) {
  try {
      console.log('Received username:', username); 
      console.log('Received password:', password); 
     

      
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
