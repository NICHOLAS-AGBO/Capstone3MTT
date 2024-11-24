const express = require('express')
const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')
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
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        req.session.userId = user._id;
        res.json({ message: 'Logged in successfully', user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send({ message: 'Could not log out, please try again' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });

module.exports = router
//export default router;

