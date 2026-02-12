const Inspections = require('../models/inspections.model');

class InspectionsController {
  // Get all inspections
  async getAll(req, res) {
    try {
      const { project_id, result, start_date, end_date } = req.query;
      
      let inspections;
      if (project_id) {
        inspections = await Inspections.findByProject(project_id);
      } else if (result) {
        inspections = await Inspections.findByResult(result);
      } else if (start_date && end_date) {
        inspections = await Inspections.findByDateRange(start_date, end_date);
      } else {
        inspections = await Inspections.findAll();
      }
      
      res.json({
        success: true,
        count: inspections.length,
        data: inspections
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching inspections',
        error: error.message
      });
    }
  }

  // Get inspection by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const inspection = await Inspections.findById(id);
      
      if (!inspection) {
        return res.status(404).json({
          success: false,
          message: 'Inspection not found'
        });
      }
      
      res.json({
        success: true,
        data: inspection
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching inspection',
        error: error.message
      });
    }
  }

  // Create new inspection
  // Create new inspection
async create(req, res) {
  try {
    const { project_id, date, type, inspector, result, notes } = req.body;
    
    // ADD THESE DEBUG LOGS
    console.log('Received req.body:', req.body);
    console.log('Result value:', result);
    console.log('Result type:', typeof result);
    console.log('Result length:', result?.length);
    console.log('Result trimmed:', result?.trim());
    
    // Validation
    if (!project_id || !date || !type || !inspector || !result) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, date, type, inspector, and result are required'
      });
    }

    // Validate result enum
    console.log('Testing includes:', ['Passed', 'Failed', 'Conditional'].includes(result));
    if (!['Passed', 'Failed', 'Conditional'].includes(result)) {
      return res.status(400).json({
        success: false,
        message: 'Result must be Passed, Failed, or Conditional'
      });
    }

    const inspection = await Inspections.create({
      project_id,
      date,
      type,
      inspector,
      result,
      notes
    });
    
    res.status(201).json({
      success: true,
      message: 'Inspection created successfully',
      data: inspection
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating inspection',
      error: error.message
    });
  }
}

  // Update inspection
  async update(req, res) {
    try {
      const { id } = req.params;
      const { project_id, date, type, inspector, result, notes } = req.body;
      
      const existingInspection = await Inspections.findById(id);
      if (!existingInspection) {
        return res.status(404).json({
          success: false,
          message: 'Inspection not found'
        });
      }

      const inspection = await Inspections.update(id, {
        project_id,
        date,
        type,
        inspector,
        result,
        notes
      });
      
      res.json({
        success: true,
        message: 'Inspection updated successfully',
        data: inspection
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating inspection',
        error: error.message
      });
    }
  }

  // Delete inspection
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Inspections.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Inspection not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Inspection deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting inspection',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const { project_id } = req.query;
      
      let stats;
      if (project_id) {
        stats = await Inspections.getProjectStats(project_id);
      } else {
        stats = await Inspections.getStats();
      }
      
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

module.exports = new InspectionsController();