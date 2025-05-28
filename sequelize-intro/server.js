import express from 'express';
import chalk from 'chalk';
import cors from 'cors';

import { Sequelize, DataTypes } from 'sequelize';

// Initializiere Sequelize mit dem Connection String.
const sequelize = new Sequelize(process.env.PG_URI);

// Hier definieren wir das Model. Das übernimmt die Kommunikation mit der Datenbank für uns.
const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING, // VARCHAR(255)
  },
  ingredients: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  time: {
    type: DataTypes.INTEGER,
  },
});

// Dies erstellt die SQL Tabelle anhand unseres Modells (keine manuellen Tabellen mehr!)
Recipe.sync();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json(), cors());

app.get('/', async (req, res) => {
  // Mit sequelize.query könnt ihr auch 'rohe' SQL Queries schreiben, falls ihr die braucht
  // const dbResponse = await sequelize.query('SELECT NOW();');
  // console.log(dbResponse);

  try {
    // Kurzer Check, ob die Datenbank verbunden ist
    await sequelize.authenticate();
    res.json({ msg: 'ProductAPI up and running' });
  } catch {
    res.status(500);
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll(); // Erzeugt "SELECT * FROM recipes;" für uns
    res.json({ data: recipes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/recipes', async (req, res) => {
  const { title, ingredients, description, time } = req.body;

  try {
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      time,
    });

    res.status(201).json({ data: recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    res.json({ data: recipe });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, description, time } = req.body;

  try {
    // Recipe.update() führt automatisch auch partielle Updates durch, falls ein Feld undefined ist
    const dbResponse = await Recipe.update(
      { title, ingredients, description, time },
      { where: { id }, returning: true }
    ); // UPDATE... WHERE recipes.id = req.params.id

    if (dbResponse[0] !== 1) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    res.json({ data: dbResponse[1] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbResponse = await Recipe.destroy({ where: { id } });

    if (dbResponse !== 1) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    res.status(204).json({ msg: 'Delete successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.listen(port, () => console.log(chalk.bgGreen(`Server läuft auf port ${port}`)));
