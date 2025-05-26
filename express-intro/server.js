import express from 'express';
import { Pool } from 'pg';

const connectionString = process.env.PG_URI;
// console.log(connectionString);
const pool = new Pool({ connectionString });

// Daten im Arbeitspeicher - sont nicht üblich, hier nur als Beispiel
const books = [
  { id: 1, title: 'Wheel of Time' },
  { id: 2, title: 'The Hobbit' },
];

// http.createServer()
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * from users;');
  res.json({ data: rows });
});

app.get('/books', async (req, res) => {
  const { rows } = await pool.query('SELECT * from books; ');
  // res.json(books);

  res.json({ message: 'Here are all the books', data: rows });
});

app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  // console.log(bookId);

  const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);

  res.json({ message: 'Here the book', data: rows[0] });
});

app.post('/books', async (req, res) => {
  // const { title, author, genre } = req.body;
  const { title } = req.body;

  // const { rows } = await pool.query(`INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *;`, [title, author, genre]);

  const { rows } = await pool.query(`INSERT INTO books (title) VALUES ($1) RETURNING *;`, [title]);

  res.json({ message: 'This is the book post endpoint', data: rows });
});

app.put('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { title } = req.body;

  const { rows, rowCount } = await pool.query(
    `
    UPDATE books 
      SET title = $1
    WHERE id = $2
    RETURNING *;
    `,
    [title, bookId]
  );

  if (rowCount !== 1) {
    res.status(404).json({ message: 'Book not found' });
  }

  // console.log(rows);

  res.json({ message: `Updated book no. ${req.params.bookId}`, data: rows[0] });
});

app.delete('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;

  const { rows, rowCount } = await pool.query('DELETE FROM books WHERE id = $1 RETURNING * ', [bookId]);

  // console.log(dbResponse);
  if (rowCount !== 1) {
    res.status(404).json({ message: 'Book not found' });
  }

  res.json({ message: `Deleted book no. ${req.params.bookId}`, data: rows[0] });
});

// server.listen
app.listen(3000, () => console.log(`Server läuft auf port 3000`));
