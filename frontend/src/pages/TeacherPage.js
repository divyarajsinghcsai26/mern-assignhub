import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherPage() {
  const [assignments, setAssignments] = useState([]); // List of assignments
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' }); // New assignment data
  const [submissions, setSubmissions] = useState([]); // Submissions for a selected assignment
  const [selectedAssignment, setSelectedAssignment] = useState(''); // Selected assignment ID
  const [grade, setGrade] = useState(''); // Grade to be assigned

  // Fetch assignments for the teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/teacher/assignments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAssignments(response.data);
      } catch (err) {
        console.error('Error fetching assignments:', err.message);
        alert('Error fetching assignments');
      }
    };
    fetchAssignments();
  }, []);

  // Handle adding a new assignment
  const handleAddAssignment = async () => {
    try {
      await axios.post('http://localhost:5000/teacher/add-assignment', newAssignment, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Assignment added successfully');
      window.location.reload(); // Reload the page to reflect changes
    } catch (err) {
      console.error('Error adding assignment:', err.message);
      alert('Error adding assignment');
    }
  };

  // Fetch submissions for a selected assignment
  const handleViewSubmissions = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    try {
      const response = await axios.get(`http://localhost:5000/teacher/submissions/${assignmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubmissions(response.data);
    } catch (err) {
      console.error('Error fetching submissions:', err.message);
      alert('Error fetching submissions');
    }
  };

  // Handle grading a submission
  const handleGradeSubmission = async (submissionId) => {
    if (!grade) {
      alert('Please enter a grade');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/teacher/submissions/${submissionId}/grade`,
        { grade },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Grade submitted successfully');
      handleViewSubmissions(selectedAssignment); // Refresh submissions after grading
    } catch (err) {
      console.error('Error grading submission:', err.message);
      alert('Error grading submission');
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>

      {/* Assignments List */}
      <h3>Assignments</h3>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id}>
            <strong>{assignment.title}:</strong> {assignment.description}{' '}
            <button onClick={() => handleViewSubmissions(assignment._id)}>View Submissions</button>
          </li>
        ))}
      </ul>

      {/* Add New Assignment */}
      <h3>Add Assignment</h3>
      <input
        placeholder="Title"
        value={newAssignment.title}
        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={newAssignment.description}
        onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
      ></textarea>
      <button onClick={handleAddAssignment}>Add Assignment</button>

      {/* Submissions for Selected Assignment */}
      {submissions.length > 0 && (
        <div>
          <h3>Submissions for Assignment</h3>
          <ul>
  {submissions.map((submission) => (
    <li key={submission._id}>
      <strong>Student ID:</strong> {submission.studentId} <br />
      <strong>File:</strong>{' '}
      <a href={`http://localhost:5000/${submission.file}`} target="_blank" rel="noreferrer">
        Download Submission
      </a>
      <br />
      <strong>Grade:</strong> {submission.grade || 'Not Graded'}
      <div>
        <input
          type="text"
          placeholder="Enter Grade"
          onChange={(e) => setGrade(e.target.value)}
        />
        <button onClick={() => handleGradeSubmission(submission._id)}>Submit Grade</button>
      </div>
    </li>
  ))}
</ul>

        </div>
      )}
    </div>
  );
}

export default TeacherPage;
