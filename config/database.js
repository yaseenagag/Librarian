const databaseName = 'Librarian'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const db = pgp(connectionString)


const selectAllBooks = () => {
  return db.any( 'SELECT * FROM books' )
}

module.exports = { selectAllBooks }
