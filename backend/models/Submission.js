const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  studentId: {
    type: String, // Change this from ObjectId to String
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    default: 'Not Graded',
  },
  filePath: {
    type: String,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
