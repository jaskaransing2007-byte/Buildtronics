const express = require('express');
const users = require('../data/user');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const currentUser = users.find(u => u.id === req.userId);

  const matches = users
    .filter(u => u.id !== req.userId)
    .map(u => {
      let score = 0;

      currentUser.learnSkills.forEach(s => {
        if (u.teachSkills.includes(s)) score += 10;
      });

      currentUser.teachSkills.forEach(s => {
        if (u.learnSkills.includes(s)) score += 10;
      });

      return { ...u, score };
    })
    .filter(u => u.score > 0)
    .sort((a, b) => b.score - a.score);

  res.json(matches);
});

module.exports = router;
