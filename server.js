require('dotenv').config();
const express = require('express');
const dbPool = require('./db'); // import db.js
const cors = require('cors'); // Ensure cors 

const app = express();
app.use(express.json());
app.use(cors()); // Allow all cors
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
const awarenessRoutes = require('./routes/awareness');
const recoveryGuideRoutes = require('./routes/recovery_guides');
const emergencyContactRoutes = require('./routes/emergency_contacts');
const categoryRoutes = require('./routes/categories');
const policiesRoutes = require('./routes/policies');
const notificationsRoutes = require('./routes/notifications');
const authRoutes = require('./routes/auth'); // Import auth routes
const usersRoutes = require('./routes/users'); // Import users routes
const reportsRoutes = require('./routes/reports'); // Import reports routes
const faqsRoutes = require('./routes/faqs'); // Import faqs routes
const dashboardRoutes = require('./routes/dashboard'); // Import dashboard routes

app.use('/api/awareness', awarenessRoutes);
app.use('/api/recovery-guides', recoveryGuideRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/policies', policiesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/users', usersRoutes); // Use users routes
app.use('/api/reports', reportsRoutes); // Use reports routes
app.use('/api/faqs', faqsRoutes); // Use faqs routes
app.use('/api/dashboard', dashboardRoutes); // Use dashboard routes


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});