const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Add a new assignment
exports.addAssignment = async (req, res) => {
  const { title, description } = req.body;

  try {
    const assignment = new Assignment({
      title,
      description,
      teacher: req.user.id,
    });
    await assignment.save();

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (err) {
    console.error('Error adding assignment:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all assignments for a teacher
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.id });
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get submissions for a specific assignment// Get submissions for a specific assignment
exports.getSubmissionsForTeacher = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('studentId', 'name id') // Populate name and id of the student
      .populate('assignmentId', 'title description'); // Populate title and description of the assignment

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Grade a submission
exports.gradeSubmission = async (req, res) => {
  const { grade } = req.body;

  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ message: 'Grade updated successfully', submission });
  } catch (err) {
    console.error('Error grading submission:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
