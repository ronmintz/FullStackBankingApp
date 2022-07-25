var express = require('express');
var app     = express();
var cors    = require('cors');
var dal     = require('./dal.js');

// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());

var logged_in_account_doc = null; // document for logged in account

// create user account
app.get('/account/create/:name/:email/:password', function (req, res) {
    // check if account exists
    dal.find_account_docs(req.params.email)
        .then((acct_docs) => {

            // if user exists, return error message
            if(acct_docs.length > 0){
                logged_in_account_doc = null; // log out any previous user
                console.log('User already exists');
                res.send({msg: 'User already exists'});    
            }
            else{
                // else create user
                dal.create_account_doc(req.params.name,req.params.email,req.params.password)
                    .then((acct_doc) => {
                        // automatically log in the created account so user
                        // can deposit to it.
                        logged_in_account_doc = acct_doc;
                        console.log(acct_doc);
                        res.send(acct_doc);            
                    });            
            }

        });

});

// login user 
app.get('/account/login/:email/:password', function (req, res) {
    dal.find_account_docs(req.params.email)
        .then((acct_docs) => {

            // if acct_docs exists, check password
            if (acct_docs.length > 0) {
                if (acct_docs[0].password === req.params.password){
                    logged_in_account_doc = acct_docs[0]; // document for logged in account
                    res.send(logged_in_account_doc);
                }
                else {
                    logged_in_account_doc = null; // log out any previous user
                    res.send({msg: 'Login failed: wrong password'});
                }
            }
            else {
                logged_in_account_doc = null; // log out any previous user
                res.send({msg: 'Login failed: user not found'});
            }
    });
});


// Preauthorized login. User's email has already been validated by Google so there is no need to check password.
// Just check that account has been created for this email.
app.get('/account/preauthorizedlogin/:email', function (req, res) {
    dal.find_account_docs(req.params.email)
        .then((acct_docs) => {
            if (acct_docs.length > 0) {  // account has been created for this email
                logged_in_account_doc = acct_docs[0]; // document for logged in account
                res.send(logged_in_account_doc);
            }
            else {
                logged_in_account_doc = null; // log out any previous user
                res.send({msg: 'Login failed: user not found'}); // No account has been created for this email
            }
    });
});


// logout user
app.get('/account/logout', function (req, res) {
    logged_in_account_doc = null; 
    res.send(null);
});

// get balance of logged in account
app.get('/account/balance', function (req, res) {
    if (logged_in_account_doc === null) {
        console.log('no one logged in');
        res.send({balance:null});
    }
    else {
        console.log(logged_in_account_doc.balance)
        res.send({balance: logged_in_account_doc.balance});
    }
});

// deposit
app.get('/account/deposit/:amount', function (req, res) {
    if (logged_in_account_doc === null) {
        res.send({balance:null});
        return;
    }

    logged_in_account_doc.balance += Number(req.params.amount);
    dal.update_account_balance(logged_in_account_doc) // update this document in database
        .then ((doc) => {
            console.log(doc);
            res.send(doc); // doc with new balance
        });   
});

// withdraw
app.get('/account/withdraw/:amount', function (req, res) {
    if (logged_in_account_doc === null) {
        res.send({balance:null});
        return;
    }

    logged_in_account_doc.balance -= Number(req.params.amount);
    dal.update_account_balance(logged_in_account_doc) // update this document in database
        .then ((doc) => {
            console.log(doc);
            res.send(doc); // doc with new balance
        });   
});

// transfer to another account
app.get('/account/transfer/:transferee_email/:amount', function (req, res) {
    if (logged_in_account_doc === null) {
        res.send({balance:null});
        return;
    }

    dal.find_account_docs(req.params.transferee_email)
        .then(async (acct_docs) => {
            if(acct_docs.length > 0) {
                var transferee_account_doc = acct_docs[0];
                
                transferee_account_doc.balance += Number(req.params.amount);
                await dal.update_account_balance(transferee_account_doc); // update this document in database
                logged_in_account_doc.balance -= Number(req.params.amount);
                dal.update_account_balance(logged_in_account_doc) // update this document in database
                    .then ((doc) => {
                        console.log(doc);
                        res.send(doc); // logged in acct doc with new balance
                    });
            }
            else {
                res.send({msg: 'Transfer failed: transferee email not found'});
            }
        });
});

// all accounts
app.get('/account/all', function (req, res) {
    dal.all_account_docs()
       .then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

var port = 3001;
app.listen(port);
console.log('Running on port: ' + port);