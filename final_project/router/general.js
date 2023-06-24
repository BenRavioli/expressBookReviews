const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    console.log(users)
  if (isValid(req.body.username)) {
    let username = req.body.username
    let password = req.body.password
    let newUser = new Object({username, password});
    users.push(newUser);
    return res.status(300).json({message: "User " + newUser.username + " successfully registered!"});
  } else {
    return res.status(300).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.status(200).send(JSON.stringify({books})));
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const get__by_ISBN = new Promise((resolve, reject) => {
        resolve(res.status(200).send(books[req.params.isbn]))
    });
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksByAuthor = [];
  for(i=1; i <= Object.keys(books).length; i++){
    if (books[i].author === req.params.author) {
        booksByAuthor.push(JSON.stringify(books[i]))
    }
  };
  return res.status(200).json({booksByAuthor});
});

public_users.get('/async/author/:author', async function (req, res) {
    let booksByAuthor = await new Promise((resolve) =>
        resolve(books.filter(book => book.author === author));
    );
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksByTitle = [];
    for(i=1; i <= Object.keys(books).length; i++){
      if (books[i].title === req.params.title) {
          booksByTitle.push(JSON.stringify(books[i]))
      }
    };
    return res.status(200).json({booksByTitle});
});

//  Get book review 
public_users.get('/review/:isbn',function (req, res) {
    let reviewResults = [];
    reviewResults.push(books[req.params.isbn].reviews);

    return res.status(200).json({reviewResults});
});

module.exports.general = public_users;
