import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Note = sequelize.define('note', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Note.sync();

export default Note;
