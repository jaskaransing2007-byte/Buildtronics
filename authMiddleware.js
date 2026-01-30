const jwt = require('jsonwebtoken');
const SECRET = 'skilio_secret';

module.exports = function (req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
