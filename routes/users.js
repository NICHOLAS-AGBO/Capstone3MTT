const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const router = express.Router();

// GET route for /login to explain usage
router.get('/login', (req, res) => {
    res.status(200).json({
      message: "This is the login endpoint. Please use POST method with username and password in the request body to login.",
      example: {
        method: "POST",
        body: {
          username: "your_username",
          password: "your_password"
        }
      }
    });
  });
  

router.post('/register', async (req, res) => {
    try {
      const { firstName, lastName, email, username, password } = req.body;
      const user = new User({ firstName, lastName, email, username, password });
      await user.save();
      res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        // Duplicate key error
        res.status(400).send({ message: 'Username or email already exists' });
      } else {
        res.status(400).send({ message: error.message });
      }
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send({ message: 'Invalid username or password' });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).send({ message: 'Invalid username or password' });
      }
      req.session.userId = user._id;
      await req.session.save();
      console.log('Login successful - Session:', req.session);
      res.send({ message: 'Logged in successfully', user: { id: user._id, username: user.username } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).send(error);
    }
  });

  router.post('/logout', (req, res) => {
    console.log('Logout attempt - Session before destroy:', req.session);
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).send({ message: 'Could not log out, please try again' });
      }
      res.clearCookie('connect.sid');
      console.log('Logout successful - Session destroyed');
      res.send({ message: 'Logged out successfully' });
    });
  });
  
  router.get('/me', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).send({ message: 'Not authenticated' });
      }
      const user = await User.findById(req.session.userId).select('-password');
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).send({ message: 'Server error' });
    }
  });

module.exports = router
//export default router;

