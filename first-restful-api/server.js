import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { query } from './db/index.js';

// Wir brauchen eine Tabelle in unserer Datenbank. So kann die Query aussehen:

// CREATE TABLE "public"."products" (
//   "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   "name" varchar(500),
//   "image" varchar(500),
//   "description" text,
//   "category" varchar(255),
//   "price" bigint, -- Kann auch decimal, money, real sein. Aber als Centbeträge lässt es sich sicherer speichern.
//   "stock" integer
// )

// Setzt den Port wie in der Postman Collection.
const port = process.env.PORT || 3000;

const app = express();
// Für JSON Parsing und evt. Frontends
app.use(express.json(), cors());

// Für die Aufgabe nicht nötig, nur ein kleiner Health Check, ob alles läuft.
app.get('/', async (req, res) => {
  const { rows } = await query('SELECT NOW();');
  res.json({ msg: 'ProductAPI up and running', time: rows[0] });
});

app.get('/products', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT name, image, description, category, (price::money / 100) as price, stock from products;' // hier teile ich den Preis, der in Centbeträgen gespeichert ist durch 100 und bringe ihn in ein für's Frontend nutzbares Format.
    );
    res.json({ data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/products', async (req, res) => {
  const { name, image, description, category, price, stock } = req.body;
  // Validiere notwendige Daten. (Mit richtiger Validation beschaftigen wir uns später eingehender.)
  if (!name) return res.status(400).json({ msg: 'Name required' });

  // Mögliche Datenbearbeitung
  const priceInCent = price * 100;

  try {
    const { rows } = await query(
      'INSERT INTO products (name, image, description, category, price, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      [name, image, description, category, priceInCent, stock]
    );
    // Status Code 201 für erfolgreichen neuen Eintrag
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
      'SELECT name, image, description, category, (price::money / 100) as price, stock from products WHERE id = $1;',
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

  // Wenn kein Pris beim partiellen Update mitgesendet wurde, müssen wir sicher gehen, dass der Parameter priceInCent, der in die SQL Query geht, auch wirklich null ist. (undefined * 100 = NaN !== null)
  const priceInCent = price ? price * 100 : null;

  try {
    // Mit COALSECE(<neuer wert>, <columnname>) updaten wir eine Spalte nur, wenn unsere Variable nicht `null` ist.
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
      RETURNING name, image, description, category, (price::money / 100) as price, stock;
      `, // Im Returning könnt ihr euch auch aussuchen, was zurückgegeben werden soll, auch evt. Operationen durchführen.
      [name, image, description, category, priceInCent, stock, id]
    );

    if (rowCount === 0) {
      res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ data: rows });
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
