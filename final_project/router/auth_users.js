const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let alreadyThere = false
    if(users.length > 0) {
        for(i=0; i < users.length; i++) {
            if(users[i].username === username) {
                alreadyThere = true;
            }
        }
        return !alreadyThere;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let matchingAccount = users.filter(user => user.username === username);
    if (matchingAccount.length > 0) {
        console.log("here");
        if (matchingAccount[0].password === password) {
            console.log("Account authenticated!");
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (authenticatedUser(req.body.username, req.body.password)) {
    let accessToken = jwt.sign({
        data: req.body.username
    }, 'access', {expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken
    }

    return res.status(200).send("User successfully logged in!");
  } else {
      return res.status(400).send("User not authenticated!");
  }

  
});

function add_review(req) {
    let isbn = req.body.isbn;
    let review = req.body.review;
    let username = req.body.username
    books[isbn].reviews[username] = review;
};

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  add_review(req);
  res.send(books[req.params.isbn].reviews)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.body.isbn;
    let username = req.body.username;
    userReview = books[isbn].reviews[username];
    console.log("Pre-deletion " + userReview);

    if (userReview != {}) {
        delete(books[isbn].reviews[username]);
        res.send("Review deleted!");
        console.log("Post-deletion " + books[isbn].reviews);
    } else {
        res.send("No review to delete!");
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
