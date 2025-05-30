import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const User = sequelize.define('user', {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// User.sync();

export default User;
