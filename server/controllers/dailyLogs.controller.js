const DailyLogs = require('../models/dailyLogs.model');

class DailyLogsController {
  // Get all daily logs
  async getAll(req, res) {
    try {
      const { project_id, start_date, end_date, search, today } = req.query;
      
      let logs;
      if (today) {
        logs = await DailyLogs.findToday();
      } else if (project_id) {
        logs = await DailyLogs.findByProject(project_id);
      } else if (start_date && end_date) {
        logs = await DailyLogs.findByDateRange(start_date, end_date);
      } else if (search) {
        logs = await DailyLogs.search(search);
      } else {
        logs = await DailyLogs.findAll();
      }
      
      res.json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      console.error('Error fetching daily logs:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching daily logs',
        error: error.message
      });
    }
  }

  // Get daily log by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const log = await DailyLogs.findById(id);
      
      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Daily log not found'
        });
      }
      
      res.json({
        success: true,
        data: log
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching daily log',
        error: error.message
      });
    }
  }

  // Create new daily log
  async create(req, res) {
    try {
      let { 
        project_id, 
        date, 
        weather, 
        work_performed, 
        workers_count, 
        notes, 
        gps_location 
      } = req.body;
      
      // Trim string fields
      if (weather) weather = weather.trim();
      if (work_performed) work_performed = work_performed.trim();
      if (notes) notes = notes.trim();
      if (gps_location) gps_location = gps_location.trim();
      
      // Validation
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      const log = await DailyLogs.create({
        project_id: project_id ? parseInt(project_id) : null,
        date,
        weather,
        work_performed,
        workers_count: workers_count ? parseInt(workers_count) : null,
        notes,
        gps_location
      });
      
      res.status(201).json({
        success: true,
        message: 'Daily log created successfully',
        data: log
      });
    } catch (error) {
      console.error('Error creating daily log:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating daily log',
        error: error.message
      });
    }
  }

  // Update daily log
  async update(req, res) {
    try {
      const { id } = req.params;
      let { 
        project_id, 
        date, 
        weather, 
        work_performed, 
        workers_count, 
        notes, 
        gps_location 
      } = req.body;
      
      const existingLog = await DailyLogs.findById(id);
      if (!existingLog) {
        return res.status(404).json({
          success: false,
          message: 'Daily log not found'
        });
      }

      // Trim string fields
      if (weather) weather = weather.trim();
      if (work_performed) work_performed = work_performed.trim();
      if (notes) notes = notes.trim();
      if (gps_location) gps_location = gps_location.trim();

      const log = await DailyLogs.update(id, {
        project_id,
        date,
        weather,
        work_performed,
        workers_count,
        notes,
        gps_location
      });
      
      res.json({
        success: true,
        message: 'Daily log updated successfully',
        data: log
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating daily log',
        error: error.message
      });
    }
  }

  // Delete daily log
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await DailyLogs.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Daily log not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Daily log deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting daily log',
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
        stats = await DailyLogs.getProjectStats(project_id);
      } else {
        stats = await DailyLogs.getStats();
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

  // Get monthly summary
  async getMonthlySummary(req, res) {
    try {
      const { year, month } = req.query;
      
      if (!year || !month) {
        return res.status(400).json({
          success: false,
          message: 'Year and month are required'
        });
      }

      const summary = await DailyLogs.getMonthlyLogsSummary(year, month);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching monthly summary',
        error: error.message
      });
    }
  }
}

module.exports = new DailyLogsController();