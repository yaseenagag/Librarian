var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var methodOverride = require('method-override');
// var mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
// var db = mongoose.connection;
const databaseName = 'librarian'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/', router);
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// INIT DB
// var mongoURI = 'mongodb://localhost/bookstoredemo';
// mongoose.connect(mongoURI);

router.get('/', function (req, res, next) {
  res.render('index', {});
});

router.get('/addBook', function (req, res, next) {
  res.render('addBook', {});
});

router.post('/addBook', function (req, res, next) {
  //let id = req.body.id;
  const { id, title, description, image_url } = req.body;
  db
    .none(`insert into books(id, title, description, image_url)
           values( ${id}, ${title}, ${description}, ${image_url}`)
    .then(function() {
      //success!
    })
    .catch(function() {
      //failure!
      console.error("I failed")
    })
})

// db.manyOrNone('open', function () {
//   //console.log('MONGOOSE CONNECTED!');
//   var Book = require('./app/models/book');
//
//   router
//
//   .get('/', function (req, res, next) {
//     Book.find(function (err, books, count) {
//       res.render('index', { books: books });
//     });
//   })
//
//   .get('/api/books', function (req, res, next) {
//     Book.find(function (err, books, count) {
//       res.render('index', { books: books });
//     });
//   })
//
//   .get('/add/books', function (req, res, next) {
//     res.render('addBook', {});
//   })
//
//   .post('/api/books/:title', function (req, res, next) {
//     console.log('POSTING BOOKS')
//     var book = new Book({
//       title: req.params.title
//     });
//
//     book.save()
//       .then(function (book) {
//         res.json(201, book);
//       })
//       .catch(function (err) {
//         return next(err);
//       });
//   })
//
//   // .put('/api/books/:title', function (req, res, next) {
//   //   res.json({ message: 'updating the book' });
//   // });
//
//   .delete('/api/books/:id', function (req, res) {
//     Book.remove({ _id: req.params.id }, function (err, book) {
//       if (err) { res.send(err); }
//       res.json({ message: 'DONE!' });
//     });
//     // Book.findById(req.params.id, function (err, book) {
//     //   console.log('About to remove', book);
//     //   book.remove(function (err, removedBook) {
//     //     console.log('Success', removedBook);
//     //   });
//     // });
//   });
//
//   // TODO:
//   // [ ] update an existing book using .put()
//   // [ ] delete an existing book using .delete()
// });

// router.get('/', function (req, res) {
//   res.json({ message: 'We are the best' });
// });
//
// router.get('/books', function (req, res) {
//   res.json({ message: 'Books go here' });
// });

app.listen(8080);

console.log('Magic happens on port ' + 8080);
