import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentPage() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState('');


  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/student/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(response.data);
      } catch (err) {
        console.error('Error fetching assignments:', err.response?.data || err.message);
        alert(err.response?.data?.message || 'Error fetching assignments');
      }
    };

    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/student/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(response.data);
      } catch (err) {
        console.error('Error fetching submissions:', err.response?.data || err.message);
        alert(err.response?.data?.message || 'Error fetching submissions');
      }
    };

    fetchAssignments();
    fetchSubmissions();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    if (!selectedAssignment) {
      alert('Please select an assignment.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/student/assignments/${selectedAssignment}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Submission successful');
    } catch (err) {
      console.error('Error submitting assignment:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error submitting assignment');
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <h3>Assignments</h3>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id}>
            {assignment.title}: {assignment.description}
            <button onClick={() => setSelectedAssignment(assignment._id)}>Submit</button>
          </li>
        ))}
      </ul>
      {selectedAssignment && (
        <div>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button onClick={handleSubmit}>Submit File</button>
        </div>
      )}

      <h3>Your Submissions</h3>
      <ul>
        {submissions.map((submission) => (
          <li key={submission._id}>
            Assignment: {submission.assignmentId.title} <br />
            Grade: {submission.grade || 'Not graded yet'} <br />
            <a href={`http://localhost:5000/uploads/${submission.file}`} target="_blank" rel="noopener noreferrer">
              Download Submitted File
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentPage;
