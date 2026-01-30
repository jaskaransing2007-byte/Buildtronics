const express = require('express');
const cors = require('cors');
const connectDB = require("./db/connect")

const authRoutes = require('./routes/auth');
console.log('authRoutes loaded:', typeof authRoutes);
const userRoutes = require('./routes/user');
const matchRoutes = require('./routes/match');

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/match', matchRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 Skilio Backend running on http://localhost:${PORT}`);
});
