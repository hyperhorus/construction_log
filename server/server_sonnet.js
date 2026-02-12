const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const equipmentRoutes = require('./routes/equipment.routes');
const materialsRoutes = require('./routes/materials.routes');
const inspectionsRoutes = require('./routes/inspections.routes');
const subcontractorsRoutes = require('./routes/subcontractors.routes');
const photosRoutes = require('./routes/photos.routes');
const timeTrackingRoutes = require('./routes/timeTracking.routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      equipment: '/api/equipment',
      materials: '/api/materials',
      inspections: '/api/inspections',
      subcontractors: '/api/subcontractors',
      photos: '/api/photos',
      timeTracking: '/api/time-tracking'
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
app.use('/api/equipment', equipmentRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/inspections', inspectionsRoutes);
app.use('/api/subcontractors', subcontractorsRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/time-tracking', timeTrackingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
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
  console.log('   - Equipment:      /api/equipment');
  console.log('   - Materials:      /api/materials');
  console.log('   - Inspections:    /api/inspections');
  console.log('   - Subcontractors: /api/subcontractors');
  console.log('   - Photos:         /api/photos');
  console.log('   - Time Tracking:  /api/time-tracking\n');
});