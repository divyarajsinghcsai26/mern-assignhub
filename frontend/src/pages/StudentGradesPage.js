import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentGradesPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get('http://localhost:5000/student/submissions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSubmissions(response.data);
      } catch (err) {
        console.error('Error fetching grades:', err.message);
        alert('Error fetching grades');
      }
    };
    fetchGrades();
  }, []);

  return (
    <div>
      <h2>Your Grades</h2>
      <ul>
        {submissions.map((submission) => (
          <li key={submission._id}>
            Assignment: {submission.assignmentId.title} - Grade: {submission.grade || 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentGradesPage;
