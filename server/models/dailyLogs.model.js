const db = require('../config/database');

class DailyLogs {
  // Get all daily logs
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Daily_Logs ORDER BY date DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get daily log by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Daily_Logs WHERE log_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get daily logs by project
  static async findByProject(projectId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Daily_Logs WHERE project_id = ? ORDER BY date DESC',
        [projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get daily logs by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Daily_Logs WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get today's logs
  static async findToday() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Daily_Logs WHERE date = CURDATE() ORDER BY project_id'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search logs
  static async search(searchTerm) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM Daily_Logs 
         WHERE work_performed LIKE ? 
         OR notes LIKE ? 
         OR weather LIKE ?
         ORDER BY date DESC`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new daily log
  static async create(logData) {
    try {
      const { 
        project_id, 
        date, 
        weather, 
        work_performed, 
        workers_count, 
        notes, 
        gps_location 
      } = logData;
      
      const [result] = await db.query(
        `INSERT INTO Daily_Logs 
         (project_id, date, weather, work_performed, workers_count, notes, gps_location) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          project_id || null, 
          date, 
          weather || null, 
          work_performed || null, 
          workers_count || null, 
          notes || null, 
          gps_location || null
        ]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update daily log
  static async update(id, logData) {
    try {
      const { 
        project_id, 
        date, 
        weather, 
        work_performed, 
        workers_count, 
        notes, 
        gps_location 
      } = logData;
      
      await db.query(
        `UPDATE Daily_Logs 
         SET project_id = ?, date = ?, weather = ?, work_performed = ?, 
             workers_count = ?, notes = ?, gps_location = ?
         WHERE log_id = ?`,
        [project_id, date, weather, work_performed, workers_count, notes, gps_location, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete daily log
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Daily_Logs WHERE log_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_logs,
          COUNT(DISTINCT project_id) as total_projects,
          SUM(workers_count) as total_worker_days,
          AVG(workers_count) as avg_workers_per_day,
          DATE(MIN(date)) as first_log_date,
          DATE(MAX(date)) as latest_log_date
        FROM Daily_Logs
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get project statistics
  static async getProjectStats(projectId) {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_logs,
          SUM(workers_count) as total_worker_days,
          AVG(workers_count) as avg_workers_per_day,
          DATE(MIN(date)) as first_log_date,
          DATE(MAX(date)) as latest_log_date
        FROM Daily_Logs
        WHERE project_id = ?
      `, [projectId]);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get logs summary by month
  static async getMonthlyLogsSummary(year, month) {
    try {
      const [rows] = await db.query(`
        SELECT 
          DATE(date) as log_date,
          COUNT(*) as log_count,
          SUM(workers_count) as total_workers
        FROM Daily_Logs
        WHERE YEAR(date) = ? AND MONTH(date) = ?
        GROUP BY DATE(date)
        ORDER BY date
      `, [year, month]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DailyLogs;