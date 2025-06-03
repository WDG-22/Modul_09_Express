import { User, Note, UsersNotes } from '../models/associations.js';

const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json({ data: users });
};

const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const user = await User.create({ firstName, lastName, email });
  res.status(201).json({ data: user });
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, { include: Note });
  if (!user) {
    throw new Error('User not found', { cause: { statusCode: 404 } });
  }
  res.json({ data: user });
};

const updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const { id } = req.params;
  const [rowCount, users] = await User.update({ firstName, lastName, email }, { where: { id }, returning: true });
  if (!rowCount) {
    throw new Error('User not found', { cause: { statusCode: 404 } });
  }
  res.json({ data: users[0] });
};

const deletUser = async (req, res) => {
  const { id } = req.params;
  const rowCount = await User.destroy({ where: { id } });
  if (!rowCount) {
    throw new Error('User not found', { cause: { statusCode: 404 } });
  }
  res.status(204).json({ msg: 'User deleted' });
};

export { getAllUsers, createUser, getOneUser, updateUser, deletUser };
