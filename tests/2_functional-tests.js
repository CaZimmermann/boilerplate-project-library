/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');
const Book = require('../Bookmodel').Book;

chai.use(chaiHttp);

let book1;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
 /* test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .set("content-type", "application/json")
        .send({
          title: "The great Gatsby",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id', 'Response should contain _id');// Debugging
          assert.property(res.body, 'title', 'Response should contain title');// Debugging
          assert.equal(res.body.title, "The great Gatsby");
          book1 = res.body;
          console.log("Created book:", book1);  // Debugging
          done();
        })        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .set("content-type", "application/json")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        }) 
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get("/api/books")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        })
      });          
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get("/api/books/[id]")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "Invalid book ID");
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get("/api/books/[id]")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        })         
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post(`/api/books/${book1._id}`)
        .set("content-type", "application/json")
        .send({
          comment: "great book"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id'); // Debugging
          assert.property(res.body, 'title'); // Debugging
          assert.property(res.body, 'comments'); // Debugging
          assert.equal(res.body._id, book1._id);
          assert.equal(res.body.title, "The great Gatsby")
          assert.include(res.body.comments, "great book"); // Debugging
          done();
        })        
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post(`/api/books/${book1._id}`)
        .set("content-type", "application/json")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field comment");
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const invalidId = "60b6e15b6d12f1c2244f1a78";
        chai
        .request(server)
        .post(`/api/books/${invalidId}`)
        .set("content-type", "application/json")
        .send({
          comment: "This is a comment for a non-existent book"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
       chai
        .request(server)
       .delete(`/api/books/${book1._id}`)
       .end(function(err, res) {
       assert.equal(res.status, 200);
       assert.equal(res.text, "delete successful");
       done();
      });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const invalidId = "60b6e15b6d12f1c2244f1a78";
        chai
        .request(server)
        .delete(`/api/books/${invalidId}`)
        .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "no book exists");
        done();
        });

      });

  });
}); 
});
