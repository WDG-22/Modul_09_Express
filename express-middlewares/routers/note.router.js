import { Router } from 'express';
import { getAllNotes, createNote, getOneNote, updateNote, deleteNote } from '../controllers/note.controllers.js';

const noteRouter = Router();

// noteRouter.get('/', getAllNotes);
// noteRouter.post('/', createNote);
// noteRouter.get('/:id', getOneNote);
// noteRouter.put('/:id', updateNote);
// noteRouter.delete('/:id', deleteNote);

noteRouter.route('/').get(getAllNotes).post(createNote);
noteRouter.route('/:id').get(getOneNote).put(updateNote).delete(deleteNote);

export default noteRouter;
