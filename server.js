var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var methodOverride = require('method-override');

const databaseName = 'librarian'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp( connectionString )


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/', router);
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const addBook = `insert into books( title, description, image_url ) values( $1, $2, $3 ) returning id`
const getBookById = 'select title, description, image_url from books where id = $1'
const getAllBooks = 'select * from books'
const getAllAuthors = 'select * from authors'

const insertBookAuthor = 'insert into book_authors( book_id, author_id ) values ( $1, $2 )'

//Book routes

router.get('/', function (req, res, next) {
  db.any( getAllBooks ).then( books => {
    res.render('index', { books } )
  })
});

router.get('/addBook', function (req, res, next) {
  db.any( getAllAuthors ).then( authors => {
    res.render('addBook', { authors })
  })
});

router.post('/addBook', function (req, res) {
  const { title, description, image_url, author_id } = req.body

  console.log( req.body );

  db.oneOrNone( addBook, [ title, description, image_url ])
    .then(function( book ) {

      db.none( insertBookAuthor, [ book.id, author_id ] )
        .then( () => {
          res.redirect( `/book-details/${book.id}` )
        })
      })
})

router.get('/book-details/:book_id', function( req, res ) {
  const { book_id } = req.params

  db.oneOrNone( getBookById, [ book_id ] )
    .then(function( book ) {
        res.render( 'book_details', { book } )
      })
})

// --------------------------------------------------------------------------------------------------------

// author routes
const addAuthor = `insert into authors( name, description, image_url ) values( $1, $2, $3 ) returning id`

router.get('/addAuthor', function ( req, res ) {
  res.render('addAuthor')
})

router.post('/addAuthor', function ( req, res ) {
  const { name, description, image_url } = req.body

  db.oneOrNone( addAuthor, [ name, description, image_url ])
    .then(function( author ) {
        res.json( { author } )
        // res.redirect( `/author-details/${author.id}` )
      })
})


app.listen( 8080 )

console.log('Magic happens on port ' + 8080)
