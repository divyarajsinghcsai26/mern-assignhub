const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');

// Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Submit an assignment
exports.submitAssignment = async (req, res) => {
  const { id: assignmentId } = req.params; // Assignment ID from request parameters
  const studentId = req.user.id; // Extract student ID from authenticated user

  console.log('Assignment ID:', assignmentId);
  console.log('Student ID:', studentId);

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Properly instantiate ObjectId
    const assignmentObjectId = new mongoose.Types.ObjectId(assignmentId);

    const submission = new Submission({
      assignmentId: assignmentObjectId, // Properly formatted ObjectId
      studentId, // Use the studentId from req.user
      file: req.file.filename,
      filePath: req.file.path,
    });

    await submission.save();
    res.status(201).json({ message: 'Submission successful', submission });
  } catch (err) {
    console.error('Error submitting assignment:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get all submissions for the logged-in student
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id }).populate('assignmentId');
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a submission
exports.deleteSubmission = async (req, res) => {
  const { id } = req.params; // Extract submission ID from params
  try {
    const submission = await Submission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error('Error deleting submission:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
