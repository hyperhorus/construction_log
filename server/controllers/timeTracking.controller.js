const TimeTracking = require('../models/timeTracking.model');

class TimeTrackingController {
  // Get all time entries
  async getAll(req, res) {
    try {
      const { worker_id, project_id, start_date, end_date } = req.query;
      
      let entries;
      if (worker_id) {
        entries = await TimeTracking.findByWorker(worker_id);
      } else if (project_id) {
        entries = await TimeTracking.findByProject(project_id);
      } else if (start_date && end_date) {
        entries = await TimeTracking.findByDateRange(start_date, end_date);
      } else {
        entries = await TimeTracking.findAll();
      }
      
      res.json({
        success: true,
        count: entries.length,
        data: entries
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching time entries',
        error: error.message
      });
    }
  }

  // Get time entry by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const entry = await TimeTracking.findById(id);
      
      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'Time entry not found'
        });
      }
      
      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching time entry',
        error: error.message
      });
    }
  }

  // Create new time entry
  async create(req, res) {
    try {
      const { worker_id, project_id, date, hours_worked, overtime_hours } = req.body;
      
      // Validation
      if (!worker_id || !project_id || !date || hours_worked === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Worker ID, project ID, date, and hours worked are required'
        });
      }

      const entry = await TimeTracking.create({
        worker_id,
        project_id,
        date,
        hours_worked,
        overtime_hours
      });
      
      res.status(201).json({
        success: true,
        message: 'Time entry created successfully',
        data: entry
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating time entry',
        error: error.message
      });
    }
  }

  // Update time entry
  async update(req, res) {
    try {
      const { id } = req.params;
      const { worker_id, project_id, date, hours_worked, overtime_hours } = req.body;
      
      const existingEntry = await TimeTracking.findById(id);
      if (!existingEntry) {
        return res.status(404).json({
          success: false,
          message: 'Time entry not found'
        });
      }

      const entry = await TimeTracking.update(id, {
        worker_id,
        project_id,
        date,
        hours_worked,
        overtime_hours
      });
      
      res.json({
        success: true,
        message: 'Time entry updated successfully',
        data: entry
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating time entry',
        error: error.message
      });
    }
  }

  // Delete time entry
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await TimeTracking.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Time entry not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Time entry deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting time entry',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const { worker_id, project_id, start_date, end_date } = req.query;
      
      let stats;
      if (worker_id) {
        stats = await TimeTracking.getWorkerStats(worker_id, start_date, end_date);
      } else if (project_id) {
        stats = await TimeTracking.getProjectStats(project_id, start_date, end_date);
      } else {
        stats = await TimeTracking.getStats();
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

module.exports = new TimeTrackingController();