const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth.routes'); // ADD THIS
const dailyLogsRoutes = require('./routes/dailyLogs.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const materialsRoutes = require('./routes/materials.routes');
const inspectionsRoutes = require('./routes/inspections.routes');
const subcontractorsRoutes = require('./routes/subcontractors.routes');
const photosRoutes = require('./routes/photos.routes');
const timeTrackingRoutes = require('./routes/timeTracking.routes');
const reportsRoutes = require('./routes/reports.routes');
const projectsRoutes = require('./routes/projects.routes');
const issuessRoutes = require('./routes/issues.routes');
const safetyIncidentsRoutes = require('./routes/safetyIncidents.routes');
const permitsRoutes = require('./routes/permits.routes');
const documentsRoutes = require('./routes/documents.routes');
const workersRoutes = require('./routes/workers.routes');
const rolesRoutes = require('./routes/roles.routes');
//const { default: SafetyIncidents } = require('../client/src/pages/SafetyIncidents');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ADD THIS

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Construction Log API', 
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      dailyLogs: '/api/daily-logs',
      equipment: '/api/equipment',
      materials: '/api/materials',
      inspections: '/api/inspections',
      subcontractors: '/api/subcontractors',
      photos: '/api/photos',
      timeTracking: '/api/time-tracking',
      projects:'api/projects',
      issues:'api/issues',
      safetyIncidents:'api/safety-incidents',
      permits:'api/permits',
      documents:'api/documents',
      workers:'api/workers',
      roles:'api/roles',

    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes); // ADD THIS
app.use('/api/daily-logs', dailyLogsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/inspections', inspectionsRoutes);
app.use('/api/subcontractors', subcontractorsRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/time-tracking', timeTrackingRoutes);
app.use('/api/reports', reportsRoutes); // ADD THIS
app.use('/api/projects', projectsRoutes); // project
app.use('/api/issues', issuessRoutes);//
app.use('/api/safety-incidents', safetyIncidentsRoutes);
app.use('/api/permits', permitsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/roles', rolesRoutes);
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found, no encontrada'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log('\n📋 Available Endpoints:');
  console.log('   - Authentication:   api/auth');
  console.log('   - Daily Logs:       /api/daily-logs');
  console.log('   - Equipment:        /api/equipment');
  console.log('   - Materials:        /api/materials');
  console.log('   - Inspections:      /api/inspections');
  console.log('   - Subcontractors:   /api/subcontractors');
  console.log('   - Photos:           /api/photos');
  console.log('   - Time Tracking:    /api/time-tracking');
  console.log('   - Reports:          /api/reports')
  console.log('   - Projects:         /api/projects')
  console.log('   - Issues:           /api/issues')
  console.log('   - Safety Incidents: /api/safety-incidents')
  console.log('   - Permits:          /api/permits')
  console.log('   - Documents:        /api/documents')
  console.log('   - Workers:          /api/workers')
  console.log('   - Roles:            /api/roles\n')




});