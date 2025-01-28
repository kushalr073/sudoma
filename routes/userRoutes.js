  const express = require('express');
  const jwt = require('jsonwebtoken');
  const crypto = require('crypto');
  const bcrypt = require('bcrypt');
  const nodemailer = require('nodemailer');
  const cookieParser = require('cookie-parser'); // Import cookie-parser middleware
  const User = require('../models/User');
  const dotenv = require('dotenv');

  dotenv.config();

  const router = express.Router();

  // Middleware to parse cookies
  router.use(cookieParser());

  // Register a new user
  router.post('/register', async (req, res) => {
    try {
      const { customerID, email, username, password } = req.body;

      // Check if customerID or email already exists
      const existingUser = await User.findOne({ $or: [{ customerID }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'CustomerID or Email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const user = new User({ customerID, email, username, password: hashedPassword });
      await user.save();

      // No token or cookie set, only send success response
      res.status(201).json({ message: 'User registered successfully. Please log in.' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });


  // Login - authenticate user and generate JWT token
  router.post('/login', async (req, res) => {
    const { customerID, username, password } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ customerID });
      if(!user){
      return res.status(404).json({ message: 'User not found' });
      }
      console.log(user.username)
      console.log(username)
      if(user.username!==username)
      {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { ID: user._id, customerID: user.customerID },
        process.env.TOKEN_KEY,
        { expiresIn: '1h' }
      );

      // Set the token in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true, // Prevents client-side access for security
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
        sameSite: 'Lax', // Use 'None' if your frontend and backend are on different domains
        maxAge: 3600000, // 1 hour
      });
      
      

      res.json({
        message: 'Login successful',
        customerDetails: {
          id: user._id,
          customerID: user.customerID,
          email: user.email,
          username: user.username,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  // Logout - clear session cookie
  router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });

  router.get('/auth/check', (req, res) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'No session found' });
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      res.json({ user: { id: decoded.ID, customerID: decoded.customerID } });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Session expired or invalid' });
    }
  });




  // Forgot password - send reset token via email
  router.post('/forgot-password', async (req, res) => {
    console.log(req.body)
    const email = req.body.email.email;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('user not found')
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('user found')
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
      await user.save();

      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset Request',
        text: `Please reset your password using the following link: ${resetLink}`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error in forgot-password route:', error);
      res.status(500).json({ message: 'Error sending email', error: error.message });
    }
  });

  // Reset password - verify token and update password
  router.post('/reset-password/:token', async (req, res) => {
    const  token  = req.params.token;
    const newPassword  = req.body.newPassword.newPassword;
    console.log(req.params)
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Hash the new password
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Error resetting password', error });
    }
  });

  // Configure nodemailer for sending emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  module.exports = router;
