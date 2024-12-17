const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle registration error
    console.error('Registration error:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
};

// Function to log in a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    // Handle login error
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Function to reset a user's password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(email, hashedPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    // Handle password reset error
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// Function to send a verification code to the user's email
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
    });

    res.status(200).json({ message: 'Verification code sent', code });
  } catch (error) {
    // Handle error sending verification code
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

// Function to get the user's profile
exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // Use the authenticated user ID from the middleware
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  };
  