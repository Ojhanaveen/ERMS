const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

//  Middleware
app.use(cors());
app.use(express.json());

//  Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const engineerRoutes = require('./routes/engineerRoutes');
const userRoutes = require('./routes/userRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);            // → /api/auth/login, /register
app.use('/api/projects', projectRoutes);     // → /api/projects/
app.use('/api/engineers', engineerRoutes);   // → /api/engineers/
app.use('/api/users', userRoutes);           // → /api/users/
app.use('/api/assignments', assignmentRoutes); // → /api/assignments/

//  Root Route
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});

//  Global error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

//  MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//  Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
