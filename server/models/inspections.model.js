const db = require('../config/database');

class Inspections {
  // Get all inspections
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Inspections ORDER BY date DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get inspection by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Inspections WHERE inspection_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get inspections by project
  static async findByProject(projectId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Inspections WHERE project_id = ? ORDER BY date DESC',
        [projectId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get inspections by result
  static async findByResult(result) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Inspections WHERE result = ? ORDER BY date DESC',
        [result]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get inspections by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Inspections WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new inspection
  static async create(inspectionData) {
    try {
      const { project_id, date, type, inspector, result, notes } = inspectionData;
      const [resultData] = await db.query(
        'INSERT INTO Inspections (project_id, date, type, inspector, result, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [project_id, date, type, inspector, result, notes || null]
      );
      return this.findById(resultData.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update inspection
  static async update(id, inspectionData) {
    try {
      const { project_id, date, type, inspector, result, notes } = inspectionData;
      await db.query(
        'UPDATE Inspections SET project_id = ?, date = ?, type = ?, inspector = ?, result = ?, notes = ? WHERE inspection_id = ?',
        [project_id, date, type, inspector, result, notes, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete inspection
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Inspections WHERE inspection_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get inspection statistics
  static async getStats() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN result = 'Passed' THEN 1 ELSE 0 END) as passed,
          SUM(CASE WHEN result = 'Failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN result = 'Conditional' THEN 1 ELSE 0 END) as conditional,
          COUNT(DISTINCT project_id) as projects_inspected,
          COUNT(DISTINCT type) as inspection_types
        FROM Inspections
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get inspections by project with stats
  static async getProjectStats(projectId) {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN result = 'Passed' THEN 1 ELSE 0 END) as passed,
          SUM(CASE WHEN result = 'Failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN result = 'Conditional' THEN 1 ELSE 0 END) as conditional
        FROM Inspections
        WHERE project_id = ?
      `, [projectId]);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Inspections;