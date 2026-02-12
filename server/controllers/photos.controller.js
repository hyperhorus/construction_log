const Photos = require('../models/photos.model');
const fs = require('fs');
const path = require('path');

class PhotosController {
  // ... existing methods ...

   // Upload and create photo
  async uploadAndCreate(req, res) {
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
        if (req.file.path) fs.unlinkSync(req.file.path);
        if (req.file.processedPath) fs.unlinkSync(req.file.processedPath);
        if (req.file.thumbnailPath) fs.unlinkSync(req.file.thumbnailPath);
        
        return res.status(400).json({
          success: false,
          message: 'Log ID is required'
        });
      }

      const photoData = {
        log_id: parseInt(log_id),
        file_path: req.file.processedPath || req.file.path,
        original_filename: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        thumbnail_path: req.file.thumbnailPath || null,
        description: description || null,
        timestamp: new Date()
      };

      const photo = await Photos.createWithUpload(photoData);

      res.status(201).json({
        success: true,
        message: 'Photo uploaded and created successfully',
        data: photo
      });
    } catch (error) {
      // Clean up files on error
      if (req.file) {
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        if (req.file.processedPath && fs.existsSync(req.file.processedPath)) {
          fs.unlinkSync(req.file.processedPath);
        }
        if (req.file.thumbnailPath && fs.existsSync(req.file.thumbnailPath)) {
          fs.unlinkSync(req.file.thumbnailPath);
        }
      }

      res.status(500).json({
        success: false,
        message: 'Error uploading photo',
        error: error.message
      });
    }
  }

  // Delete photo (enhanced to delete files)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Get photo details before deletion
      const photo = await Photos.findById(id);
      
      if (!photo) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      // Delete from database
      const deleted = await Photos.delete(id);
      
      if (deleted) {
        // Delete physical files
        if (photo.file_path && fs.existsSync(photo.file_path)) {
          fs.unlinkSync(photo.file_path);
        }
        if (photo.thumbnail_path && fs.existsSync(photo.thumbnail_path)) {
          fs.unlinkSync(photo.thumbnail_path);
        }
        
        res.json({
          success: true,
          message: 'Photo and files deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting photo',
        error: error.message
      });
    }
  }
}

module.exports = new PhotosController();