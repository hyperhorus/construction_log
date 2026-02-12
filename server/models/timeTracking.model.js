const db = require('../config/database');

class TimeTracking {
  // Get all time entries
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Time_Tracking ORDER BY date DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get time entry by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Time_Tracking WHERE entry_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get time entries by worker
  static async findByWorker(workerId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Time_Tracking WHERE worker_id = ? ORDER BY date DESC',
        [workerId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get time entries by project
  static async findByProject(projectId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Time_Tracking WHERE project_id = ? ORDER BY date DESC',
        [projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get time entries by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Time_Tracking WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new time entry
  static async create(timeData) {
    try {
      const { worker_id, project_id, date, hours_worked, overtime_hours } = timeData;
      const [result] = await db.query(
        'INSERT INTO Time_Tracking (worker_id, project_id, date, hours_worked, overtime_hours) VALUES (?, ?, ?, ?, ?)',
        [worker_id, project_id, date, hours_worked, overtime_hours || 0]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update time entry
  static async update(id, timeData) {
    try {
      const { worker_id, project_id, date, hours_worked, overtime_hours } = timeData;
      await db.query(
        'UPDATE Time_Tracking SET worker_id = ?, project_id = ?, date = ?, hours_worked = ?, overtime_hours = ? WHERE entry_id = ?',
        [worker_id, project_id, date, hours_worked, overtime_hours, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete time entry
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Time_Tracking WHERE entry_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get worker statistics
  static async getWorkerStats(workerId, startDate = null, endDate = null) {
    try {
      let query = `
        SELECT 
          worker_id,
          COUNT(*) as total_entries,
          SUM(hours_worked) as total_hours,
          SUM(overtime_hours) as total_overtime,
          AVG(hours_worked) as avg_hours_per_day
        FROM Time_Tracking
        WHERE worker_id = ?
      `;
      const params = [workerId];
      
      if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }
      
      const [stats] = await db.query(query, params);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get project statistics
  static async getProjectStats(projectId, startDate = null, endDate = null) {
    try {
      let query = `
        SELECT 
          project_id,
          COUNT(DISTINCT worker_id) as total_workers,
          COUNT(*) as total_entries,
          SUM(hours_worked) as total_hours,
          SUM(overtime_hours) as total_overtime
        FROM Time_Tracking
        WHERE project_id = ?
      `;
      const params = [projectId];
      
      if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }
      
      const [stats] = await db.query(query, params);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get overall statistics
  static async getStats() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_entries,
          COUNT(DISTINCT worker_id) as total_workers,
          COUNT(DISTINCT project_id) as total_projects,
          SUM(hours_worked) as total_hours,
          SUM(overtime_hours) as total_overtime,
          AVG(hours_worked) as avg_hours_per_entry
        FROM Time_Tracking
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TimeTracking;