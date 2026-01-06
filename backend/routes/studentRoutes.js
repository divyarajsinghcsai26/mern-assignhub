const express = require('express');
const { getAssignments, submitAssignment, getSubmissions } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');


// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router(); // Initialize router before using it

// GET /student/assignments - Get all assignments
router.get('/assignments', authMiddleware(['student']), getAssignments);

// GET /student/submissions - Get all submissions for the logged-in student
router.get('/submissions', authMiddleware(['student']), getSubmissions);

// POST /student/assignments/:id/submit - Submit an assignment
router.post('/assignments/:id/submit', authMiddleware(['student']), upload.single('file'), submitAssignment);

module.exports = router;
