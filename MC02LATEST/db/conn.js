const { MongoClient } = require('mongodb');

const mongoURl = "mongodb://localhost:27017";
const client = new MongoClient(mongoURl);

function connectToMongo() {
    return new Promise((resolve, reject) => {
        client.connect().then((connectedClient) => {
           
            resolve(connectedClient.db());
            //console.log("Connected to MongoDB server");
        }).catch(err => {
            console.error("Failed to connect to MongoDB:", err);
            reject(err);
        });
    });
}

client.connect().then(() => {
    console.log("Connected to MongoDB server");
})

function getDb(dbName = "MCo3") {
    return client.db(dbName);
}

function signalHandler() {
    console.log("Closing MongoDB connection");
    client.close();
    process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);

const dbPromise = connectToMongo();

const accountsCollectionPromise = dbPromise.then(db => db.collection('accounts'));
const postsCollectionPromise = dbPromise.then(db => db.collection('posts'));

module.exports = {
    connectToMongo,
    getDb,
    accountsCollectionPromise,
    postsCollectionPromise
};
