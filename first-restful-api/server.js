import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { query } from './db/index.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json(), cors());

app.get('/', async (req, res) => {
  const { rows } = await query('SELECT NOW();');
  res.json({ msg: 'ProductAPI up and running', time: rows[0] });
});

app.get('/products', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT name, image, description, category, (price / 100) as price, stock from products;'
    );
    res.json({ data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/products', async (req, res) => {
  const { name, image, description, category, price, stock } = req.body;

  if (!name) return res.status(400).json({ msg: 'Name required' });

  const priceInCent = price * 100;

  try {
    const { rows } = await query(
      'INSERT INTO products (name, image, description, category, price, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      [name, image, description, category, priceInCent, stock]
    );
    res.status(201).json({ data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await query(
      'SELECT name, image, description, category, (price / 100) as price, stock from products WHERE id = $1;',
      [id]
    );

    if (rowCount === 0) {
      res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, description, category, price, stock } = req.body;

  if (!name) return res.status(400).json({ msg: 'Name required' });

  const priceInCent = price * 100;
  console.log(name, image, description, category, price, stock);

  try {
    const { rows, rowCount } = await query(
      `
      UPDATE products
      SET
        name = COALESCE($1, name),
        image = COALESCE($2, image),
        description = COALESCE($3, description),
        category = COALESCE($4, category),
        price = COALESCE($5, price),
        stock = COALESCE($6, stock)
      WHERE id = $7
      RETURNING *;
      `,
      [name, image, description, category, priceInCent, stock, id]
    );

    if (rowCount === 0) {
      res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ data: rows });
    // res.json({ data: 'test' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await query('DELETE FROM products WHERE id = $1 RETURNING *;', [id]);

    if (rowCount === 0) {
      res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Delete successful', data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.listen(port, () => console.log(chalk.bgGreen(`Server läuft auf port ${port}`)));
