import { MongoClient } from 'mongodb';

const mongoURl = "mongodb://localhost:27017";
const client = new MongoClient(mongoURl);

export function connectToMongo (callback) {
    client.connect().then( (client) => {
        return callback();
    }).catch( err => {
        callback(err);
    })
}

export function getDb(dbName = "MCo3"){
    return client.db(dbName)
}

function signalHandler(){
    console.log("Closing MongoDB connection");
    client.close();
    process.exit();

}


process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);