const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Name, email, and password are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      'skilio_secret_key',
      { expiresIn: '1h' }
    );

    res.json({
      msg: 'Signup successful',
      token
    });

  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
