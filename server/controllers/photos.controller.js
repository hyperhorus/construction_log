const Photos = require('../models/photos.model');
const fs = require('fs');
const path = require('path');

class PhotosController {
  // Upload photo with file
  async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { log_id, description } = req.body;

      if (!log_id) {
        // Delete uploaded file if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Log ID is required'
        });
      }

      const file_path = `/uploads/photos/${req.file.filename}`;

      const photo = await Photos.create({
        log_id: parseInt(log_id),
        file_path,
        description: description || null,
        timestamp: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Photo uploaded successfully',
        data: photo
      });
    } catch (error) {
      // Delete uploaded file if error occurs
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error uploading photo:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading photo',
        error: error.message
      });
    }
  }

  // Get all photos
  async getAll(req, res) {
    try {
      const { log_id, start_date, end_date } = req.query;
      
      let photos;
      if (log_id) {
        photos = await Photos.findByLog(log_id);
      } else if (start_date && end_date) {
        photos = await Photos.findByDateRange(start_date, end_date);
      } else {
        photos = await Photos.findAll();
      }
      
      res.json({
        success: true,
        count: photos.length,
        data: photos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching photos',
        error: error.message
      });
    }
  }

  // Get photo by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const photo = await Photos.findById(id);
      
      if (!photo) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }
      
      res.json({
        success: true,
        data: photo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching photo',
        error: error.message
      });
    }
  }

  // Create new photo
  async create(req, res) {
    try {
      const { log_id, file_path, description, timestamp } = req.body;
      
      // Validation
      if (!log_id || !file_path) {
        return res.status(400).json({
          success: false,
          message: 'Log ID and file path are required'
        });
      }

      const photo = await Photos.create({
        log_id,
        file_path,
        description,
        timestamp
      });
      
      res.status(201).json({
        success: true,
        message: 'Photo created successfully',
        data: photo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating photo',
        error: error.message
      });
    }
  }

  // Update photo
  async update(req, res) {
    try {
      const { id } = req.params;
      const { log_id, file_path, description } = req.body;
      
      const existingPhoto = await Photos.findById(id);
      if (!existingPhoto) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      const photo = await Photos.update(id, {
        log_id,
        file_path,
        description
      });
      
      res.json({
        success: true,
        message: 'Photo updated successfully',
        data: photo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating photo',
        error: error.message
      });
    }
  }

  // Delete photo
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const photo = await Photos.findById(id);
      if (!photo) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      // Delete file from filesystem
      const filePath = path.join(__dirname, '..', photo.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const deleted = await Photos.delete(id);
      
      res.json({
        success: true,
        message: 'Photo deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting photo',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const stats = await Photos.getStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }
}

module.exports = new PhotosController();