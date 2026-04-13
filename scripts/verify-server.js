const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const awarenessRoutes = require('../routes/awareness');
const recoveryGuideRoutes = require('../routes/recovery_guides');
const emergencyContactRoutes = require('../routes/emergency_contacts');
const categoryRoutes = require('../routes/categories');
const policiesRoutes = require('../routes/policies');
const notificationsRoutes = require('../routes/notifications');

app.use('/api/awareness', awarenessRoutes);
app.use('/api/recovery-guides', recoveryGuideRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/policies', policiesRoutes);
app.use('/api/notifications', notificationsRoutes);

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test Server running on http://localhost:${PORT}`);
});
