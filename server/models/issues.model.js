const db = require('../config/database');

class Issue {
  // Get all issues (with optional filters)
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          i.*,
          p.name AS project_name,
          w.name AS assigned_worker_name,
          w.role AS assigned_worker_role
        FROM issues i
        LEFT JOIN projects p ON i.project_id = p.project_id
        LEFT JOIN workers w ON i.assigned_to = w.worker_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.status) {
        query += ' AND i.status = ?';
        params.push(filters.status);
      }

      if (filters.priority) {
        query += ' AND i.priority = ?';
        params.push(filters.priority);
      }

      if (filters.project_id) {
        query += ' AND i.project_id = ?';
        params.push(filters.project_id);
      }

      if (filters.assigned_to) {
        query += ' AND i.assigned_to = ?';
        params.push(filters.assigned_to);
      }

      if (filters.start_date) {
        query += ' AND i.date_reported >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ' AND i.date_reported <= ?';
        params.push(filters.end_date);
      }

      if (filters.search) {
        query += ' AND i.description LIKE ?';
        params.push(`%${filters.search}%`);
      }

      query += ' ORDER BY i.date_reported DESC, i.priority DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get issue by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          i.*,
          p.name AS project_name,
          w.name AS assigned_worker_name,
          w.role AS assigned_worker_role
        FROM issues i
        LEFT JOIN projects p ON i.project_id = p.project_id
        LEFT JOIN workers w ON i.assigned_to = w.worker_id
        WHERE i.issue_id = ?
        `,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new issue
  static async create(issueData) {
    try {
      const {
        project_id,
        date_reported,
        description,
        status,
        priority,
        assigned_to
      } = issueData;

      const [result] = await db.query(
        `
        INSERT INTO issues 
          (project_id, date_reported, description, status, priority, assigned_to)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [project_id, date_reported, description, status, priority, assigned_to || null]
      );

      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update issue
  static async update(id, issueData) {
    try {
      const {
        project_id,
        date_reported,
        description,
        status,
        priority,
        assigned_to
      } = issueData;

      await db.query(
        `
        UPDATE issues SET
          project_id = ?,
          date_reported = ?,
          description = ?,
          status = ?,
          priority = ?,
          assigned_to = ?
        WHERE issue_id = ?
        `,
        [project_id, date_reported, description, status, priority, assigned_to || null, id]
      );

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete issue
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM issues WHERE issue_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get issues by project
  static async findByProject(project_id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          i.*,
          p.name AS project_name,
          w.name AS assigned_worker_name,
          w.role AS assigned_worker_role
        FROM issues i
        LEFT JOIN projects p ON i.project_id = p.project_id
        LEFT JOIN workers w ON i.assigned_to = w.worker_id
        WHERE i.project_id = ?
        ORDER BY i.date_reported DESC, i.priority DESC
        `,
        [project_id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const [stats] = await db.query(`
        SELECT
          COUNT(*) AS total_issues,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_issues,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_issues,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_issues,
          SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high_priority_issues,
          SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS medium_priority_issues,
          SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS low_priority_issues
        FROM issues
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Issue;