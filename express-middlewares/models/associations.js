import User from './User.js';
import Note from './Note.js';
import sequelize from '../db/index.js';

// User.hasMany(Note);
// Note.belongsTo(User);

const UsersNotes = sequelize.define('UsersNotes');

User.belongsToMany(Note, { through: 'UsersNotes' });
Note.belongsToMany(User, { through: 'UsersNotes' });

// sequelize.sync({ force: true });
sequelize.sync();

export { Note, User, UsersNotes };
