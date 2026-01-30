const express = require('express');
const users = require('../data/user');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET PROFILE
router.get('/profile', auth, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  res.json(user);
});

// UPDATE INTERESTS
router.post('/interests', auth, (req, res) => {
  const user = users.find(u => u.id === req.userId);

  const { teachSkills, learnSkills, otherInterests } = req.body;

  user.teachSkills = teachSkills;
  user.learnSkills = learnSkills;
  user.otherInterests = otherInterests;

  res.json({ msg: 'Interests updated' });
});

module.exports = router;
