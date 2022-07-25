const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('myproject');
});

// create user account using the collection.insertOne function
function create_account_doc(name, email, password) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        const doc = {name, email, password, balance: 0};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });
    });
}

// find all docs with specified email
function find_account_docs(email) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .find({ email: email })
            .toArray(function (err, docs) {
                err ? reject(err) : resolve(docs);
            });
    });
}

// store doc.balance into database document whose _id is referenced by doc._id, where
// doc is a document in memory with the above format.                                                                                                             						// document in memory with the above format.

function update_account_balance(doc) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .updateOne(
                {_id: doc._id},
                {$set: {'balance': doc.balance}},
                {w:1},
                function(err, result) {
                    err ? reject(err) : resolve(doc);
                });
    });

}

// return array of all account docs by using the collection.find method
function all_account_docs() {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
            });
    })
}

module.exports = { create_account_doc, find_account_docs, update_account_balance,
                   all_account_docs };