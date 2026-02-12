const Equipment = require('../models/equipment.model');

class EquipmentController {
  // Get all equipment
  async getAll(req, res) {
    try {
      const { status } = req.query;
      
      let equipment;
      if (status) {
        equipment = await Equipment.findByStatus(status);
      } else {
        equipment = await Equipment.findAll();
      }
      
      res.json({
        success: true,
        count: equipment.length,
        data: equipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment',
        error: error.message
      });
    }
  }

  // Get equipment by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findById(id);
      
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }
      
      res.json({
        success: true,
        data: equipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment',
        error: error.message
      });
    }
  }

  // Create new equipment
  async create(req, res) {
    try {
      const { name, type, status, last_maintenance } = req.body;
      
      // Validation
      if (!name || !type) {
        return res.status(400).json({
          success: false,
          message: 'Name and type are required'
        });
      }

      const equipment = await Equipment.create({
        name,
        type,
        status,
        last_maintenance
      });
      
      res.status(201).json({
        success: true,
        message: 'Equipment created successfully',
        data: equipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating equipment',
        error: error.message
      });
    }
  }

  // Update equipment
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, type, status, last_maintenance } = req.body;
      
      // Check if equipment exists
      const existingEquipment = await Equipment.findById(id);
      if (!existingEquipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      const equipment = await Equipment.update(id, {
        name,
        type,
        status,
        last_maintenance
      });
      
      res.json({
        success: true,
        message: 'Equipment updated successfully',
        data: equipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating equipment',
        error: error.message
      });
    }
  }

  // Delete equipment
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Equipment.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Equipment deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting equipment',
        error: error.message
      });
    }
  }

  // Get equipment statistics
  async getStats(req, res) {
    try {
      const stats = await Equipment.getStats();
      
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

module.exports = new EquipmentController();