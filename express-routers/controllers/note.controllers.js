import { Note, User, UsersNotes } from '../models/associations.js';

const getAllNotes = async (req, res) => {
  try {
    const data = await Note.findAll();
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const createNote = async (req, res) => {
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
};

const getOneNote = async (req, res) => {
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
};

const updateNote = async (req, res) => {
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
};

const deleteNote = async (req, res) => {
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
};

export { getAllNotes, createNote, getOneNote, updateNote, deleteNote };
