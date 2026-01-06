const User = require('../models/User');
const bcrypt = require('bcrypt');

// Add a new user (Admin, Teacher, or Student)
exports.addUser = async (req, res) => {
  const { id, name, email, role, password } = req.body;

  try {
    // Input validation
    if (!id || !name || !email || !role || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Normalize role to lowercase
    const validRoles = ['admin', 'teacher', 'student'];
    const normalizedRole = role.toLowerCase();
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ message: `Invalid role. Valid roles are: ${validRoles.join(', ')}` });
    }

    // Check for duplicate user
    const existingUser = await User.findOne({ $or: [{ id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID or email already exists' });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id,
      name,
      email,
      role: normalizedRole, // Save normalized role
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: 'User added successfully', user });
  } catch (err) {
    console.error('Error in addUser:', err.message); // Log the error
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request parameters
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
