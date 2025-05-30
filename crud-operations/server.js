import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

import { Note, User, UsersNotes } from './models/associations.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ msg: 'Server healthy' });
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/users', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email });
    res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: Note });
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const { id } = req.params;
  try {
    const [rowCount, users] = await User.update({ firstName, lastName, email }, { where: { id }, returning: true });
    if (!rowCount) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }
    res.json({ data: users[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rowCount = await User.destroy({ where: { id } });
    if (!rowCount) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }
    res.status(204).json({ msg: 'User deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

//
// NOTES
//

app.get('/notes', async (req, res) => {
  try {
    const data = await Note.findAll();
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/notes', async (req, res) => {
  const { content, userId } = req.body;
  try {
    // const data = await Note.create({ content, userId });

    const note = await Note.create({ content });
    await UsersNotes.create({ userId, noteId: note.id });

    res.status(201).json({ data: note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Note.findByPk(id, { include: User });
    if (!data) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/notes/:id', async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  try {
    const [rowCount, notes] = await Note.update({ content }, { where: { id }, returning: true });
    if (!rowCount) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    res.json({ data: notes[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rowCount = await Note.destroy({ where: { id } });
    if (!rowCount) {
      res.status(404).json({ msg: 'Note not found' });
      return;
    }
    res.status(204).json({ msg: 'Note deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.listen(port, () => console.log(chalk.bgGreen(` CRUD Operations listening on port ${port}  `)));
