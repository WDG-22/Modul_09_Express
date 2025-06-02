import { User, Note, UsersNotes } from '../models/associations.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email });
    res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getOneUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
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
};

const deletUser = async (req, res) => {
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
};

export { getAllUsers, createUser, getOneUser, updateUser, deletUser };
