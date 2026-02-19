const db = require('../config/database');

class Projects {
  // Get all projects
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM projects WHERE 1=1';
      const params = [];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.type) {
        query += ' AND type = ?';
        params.push(filters.type);
      }

      if (filters.client_name) {
        query += ' AND client_name LIKE ?';
        params.push(`%${filters.client_name}%`);
      }

      if (filters.location) {
        query += ' AND location LIKE ?';
        params.push(`%${filters.location}%`);
      }

      query += ' ORDER BY start_date DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get project by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM projects WHERE project_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Search projects
  static async search(keyword) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM projects 
         WHERE name LIKE ? 
         OR client_name LIKE ? 
         OR location LIKE ? 
         ORDER BY start_date DESC`,
        [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new project
  static async create(projectData) {
    try {
      const {
        name,
        type,
        location,
        start_date,
        end_date,
        status,
        budget,
        client_name,
        compliance_level,
        bim_model_link
      } = projectData;

      const [result] = await db.query(
        `INSERT INTO projects 
         (name, type, location, start_date, end_date, status, budget, client_name, compliance_level, bim_model_link) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, type, location, start_date, end_date, status, budget, client_name, compliance_level, bim_model_link]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update project
  static async update(id, projectData) {
    try {
      const {
        name,
        type,
        location,
        start_date,
        end_date,
        status,
        budget,
        client_name,
        compliance_level,
        bim_model_link
      } = projectData;

      await db.query(
        `UPDATE projects SET 
         name = ?, type = ?, location = ?, start_date = ?, end_date = ?, status = ?, 
         budget = ?, client_name = ?, compliance_level = ?, bim_model_link = ? 
         WHERE project_id = ?`,
        [name, type, location, start_date, end_date, status, budget, client_name, compliance_level, bim_model_link, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete project
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM projects WHERE project_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get project statistics
  static async getStats() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_projects,
          SUM(budget) as total_budget,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_projects,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
          SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as planned_projects,
          SUM(CASE WHEN status = 'on_hold' THEN 1 ELSE 0 END) as on_hold_projects,
          COUNT(DISTINCT client_name) as total_clients,
          AVG(budget) as avg_budget
        FROM projects
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get projects by status
  static async findByStatus(status) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM projects WHERE status = ? ORDER BY start_date DESC',
        [status]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get projects count by type
  static async getCountByType() {
    try {
      const [rows] = await db.query(`
        SELECT type, COUNT(*) as count 
        FROM projects 
        GROUP BY type
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Projects;