const express = require('express');
const { addUser, getUsers, deleteUser } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /admin/add-user - Add a new user
router.post('/add-user', authMiddleware(['admin']), addUser);

// GET /admin/users - Get all users
router.get('/users', authMiddleware(['admin']), getUsers);

// DELETE /admin/delete-user/:id - Delete a user
router.delete('/delete-user/:id', authMiddleware(['admin']), deleteUser);

module.exports = router;
