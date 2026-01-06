const express = require('express');
const {
  addAssignment,
  getAssignments,
  getSubmissionsForTeacher,
  gradeSubmission,
} = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add assignment
router.post('/add-assignment', authMiddleware(['teacher']), addAssignment);

// Get assignments
router.get('/assignments', authMiddleware(['teacher']), getAssignments);

// Get submissions for an assignment
router.get('/submissions/:id', authMiddleware(['teacher']), getSubmissionsForTeacher);

// Grade a submission
router.put('/submissions/:id/grade', authMiddleware(['teacher']), gradeSubmission);

module.exports = router;
