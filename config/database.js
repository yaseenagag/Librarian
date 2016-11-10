const databaseName = 'Librarian'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)

const getAllBooks = 'select * from books'
const addBook = `insert into books( title, description, image_url ) values( $1, $2, $3 ) returning id`
const insertBookAuthor = 'insert into book_authors( book_id, author_id ) values ( $1, $2 )'
const getAllAuthors = 'select * from authors'
const addAuthor = `insert into authors( name, description, image_url ) values( $1, $2, $3 ) returning id`
const getBookById = 'select * from books where id = $1'
const getAuthorByBookId = 'select * from book_authors where book_id = $1'

const Book = {
  getAll: () => db.any( getAllBooks ),
  addBook: book => db.oneOrNone( addBook, [ book.title, book.description, book.image_url ] ),
  setAuthor: ( book_id, author_id ) => db.none( insertBookAuthor, [ book_id, author_id ] ),
  getById: book_id => db.oneOrNone( getBookById, [ book_id ] ),
  getAuthorById: book_id => db.oneOrNone( getAuthorByBookId, [ book_id ] )
}

const Author = {
  getAll: () => db.any( getAllAuthors ),
  addAuthor: author => db.oneOrNone( addAuthor, [ author.name, author.description, author.image_url ] )
}

module.exports = { Book, Author }
