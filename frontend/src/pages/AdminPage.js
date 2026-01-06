import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  // State to hold the list of users
  const [users, setUsers] = useState([]);

  // State to hold new user details (initialized to an empty object)
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    password: '',
  });

  // Fetch users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data || err.message);
        alert('Error fetching users. Please log in again.');
      }
    };
    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/add-user', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      alert('User added successfully');
  
      // Update the users list dynamically without reloading the page
      setUsers((prevUsers) => [...prevUsers, response.data.user]);
  
      // Clear the form fields
      setNewUser({ id: '', name: '', email: '', role: '', password: '' });
    } catch (err) {
      console.error('Error adding user:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error adding user');
    }
  };
  

  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('User deleted successfully');
      window.location.reload(); // Reload page to fetch updated users
    } catch (err) {
      console.error('Error deleting user:', err.response?.data || err.message);
      alert('Error deleting user');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.role}){' '}
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Add User</h3>
      <input
        placeholder="ID"
        value={newUser.id}
        onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
      />
      <input
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        placeholder="Role (e.g., admin, teacher, student)"
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value.toLowerCase() })} // Ensure lowercase
      />
      <input
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}

export default AdminPage;
