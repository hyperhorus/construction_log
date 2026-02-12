const Subcontractors = require('../models/subcontractors.model');

class SubcontractorsController {
  // Get all subcontractors
  async getAll(req, res) {
    try {
      const { specialty, insurance_status } = req.query;
      
      let subcontractors;
      if (specialty) {
        subcontractors = await Subcontractors.findBySpecialty(specialty);
      } else if (insurance_status === 'expired') {
        subcontractors = await Subcontractors.findExpiredInsurance();
      } else if (insurance_status === 'expiring') {
        subcontractors = await Subcontractors.findExpiringInsurance();
      } else {
        subcontractors = await Subcontractors.findAll();
      }
      
      res.json({
        success: true,
        count: subcontractors.length,
        data: subcontractors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching subcontractors',
        error: error.message
      });
    }
  }

  // Get subcontractor by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const subcontractor = await Subcontractors.findById(id);
      
      if (!subcontractor) {
        return res.status(404).json({
          success: false,
          message: 'Subcontractor not found'
        });
      }
      
      res.json({
        success: true,
        data: subcontractor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching subcontractor',
        error: error.message
      });
    }
  }

  // Create new subcontractor
  async create(req, res) {
    try {
      const { company_name, specialty, contact_info, insurance_exp } = req.body;
      
      // Validation
      if (!company_name || !specialty) {
        return res.status(400).json({
          success: false,
          message: 'Company name and specialty are required'
        });
      }

      const subcontractor = await Subcontractors.create({
        company_name,
        specialty,
        contact_info,
        insurance_exp
      });
      
      res.status(201).json({
        success: true,
        message: 'Subcontractor created successfully',
        data: subcontractor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating subcontractor',
        error: error.message
      });
    }
  }

  // Update subcontractor
  async update(req, res) {
    try {
      const { id } = req.params;
      const { company_name, specialty, contact_info, insurance_exp } = req.body;
      
      const existingSubcontractor = await Subcontractors.findById(id);
      if (!existingSubcontractor) {
        return res.status(404).json({
          success: false,
          message: 'Subcontractor not found'
        });
      }

      const subcontractor = await Subcontractors.update(id, {
        company_name,
        specialty,
        contact_info,
        insurance_exp
      });
      
      res.json({
        success: true,
        message: 'Subcontractor updated successfully',
        data: subcontractor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating subcontractor',
        error: error.message
      });
    }
  }

  // Delete subcontractor
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Subcontractors.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Subcontractor not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Subcontractor deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting subcontractor',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const stats = await Subcontractors.getStats();
      
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

module.exports = new SubcontractorsController();