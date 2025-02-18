/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../Bookmodel').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        let books = await Book.find({}, '_id title commentcount');
        res.json(books);
      } catch (err) {
        res.json("Server error" );
      }
    })
    
    .post(async function (req, res){
      //response will contain new book object including atleast _id and title
      const {title} = req.body;

      if (!title) {
        res.send("missing required field title");
        return;
      }

      try {
        let book = await Book.findOne({ title: title });
        if (!book) {
          book = new Book({ title: title, commentcount: 0, comments: [] });
          await book.save();
        }
        const bookResponse = await Book.findById(book._id).select('title _id');
        res.json(bookResponse);
      } catch (err) {
        res.json("could not post");
      }
      
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.json("complete delete successful");
      } catch (err) {
        res.json("Server error");
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let book = await Book.findById(bookid, '_id title comments');

        if (!book) {
          res.send("no book exists");
        return;
        }

        res.json(book);
      } catch (err) {
        res.send("Invalid book ID" );
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment) {
        res.send("missing required field comment");
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        res.send("Invalid book ID");
        return;
      }

      try {
        let book = await Book.findByIdAndUpdate(
          bookid,
          {$push: { comments: comment }, $inc: { commentcount: 1 } },
          { new: true }
        ); 

        if (!book) {
          res.send("no book exists");
        return;
        }

        res.json(book);
      } catch (err) {
        res.send ("Invalid book ID");
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        let book = await Book.findByIdAndDelete(bookid);
    
        if (!book) {
          return res.send("no book exists"); 
        }
    
        res.send( "delete successful" ); 
      } catch (err) {
        res.send( "Server error" ); 
      }
    });
  
};
