const db = require('../config/database');

class Permit {
  // Get all permits with optional filters
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          pe.*,
          p.name AS project_name
        FROM permits pe
        LEFT JOIN projects p ON pe.project_id = p.project_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.project_id) {
        query += ' AND pe.project_id = ?';
        params.push(filters.project_id);
      }

      if (filters.permit_type) {
        query += ' AND pe.permit_type LIKE ?';
        params.push(`%${filters.permit_type}%`);
      }

      if (filters.issuing_authority) {
        query += ' AND pe.issuing_authority LIKE ?';
        params.push(`%${filters.issuing_authority}%`);
      }

      if (filters.start_date) {
        query += ' AND pe.issue_date >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ' AND pe.issue_date <= ?';
        params.push(filters.end_date);
      }

      query += ' ORDER BY pe.issue_date DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          pe.*,
          p.name AS project_name
        FROM permits pe
        LEFT JOIN projects p ON pe.project_id = p.project_id
        WHERE pe.permit_id = ?
        `,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create
  static async create(data) {
    try {
      const {
        project_id,
        permit_type,
        issuing_authority,
        issue_date,
        expiration_date,
        approved_by,
      } = data;

      const [result] = await db.query(
        `
        INSERT INTO permits
          (project_id, permit_type, issuing_authority, issue_date, expiration_date, approved_by)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          project_id,
          permit_type,
          issuing_authority,
          issue_date,
          expiration_date || null,
          approved_by || null,
        ]
      );

      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update
  static async update(id, data) {
    try {
      const {
        project_id,
        permit_type,
        issuing_authority,
        issue_date,
        expiration_date,
        approved_by,
      } = data;

      await db.query(
        `
        UPDATE permits SET
          project_id = ?,
          permit_type = ?,
          issuing_authority = ?,
          issue_date = ?,
          expiration_date = ?,
          approved_by = ?
        WHERE permit_id = ?
        `,
        [
          project_id,
          permit_type,
          issuing_authority,
          issue_date,
          expiration_date || null,
          approved_by || null,
          id,
        ]
      );

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM permits WHERE permit_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // By project
  static async findByProject(project_id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          pe.*,
          p.name AS project_name
        FROM permits pe
        LEFT JOIN projects p ON pe.project_id = p.project_id
        WHERE pe.project_id = ?
        ORDER BY pe.issue_date DESC
        `,
        [project_id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Stats (total, active, expired, expiring in 30 days)
  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT
          COUNT(*) AS total_permits,
          SUM(
            CASE 
              WHEN expiration_date IS NULL THEN 0
              WHEN expiration_date >= CURDATE() THEN 1
              ELSE 0
            END
          ) AS active_permits,
          SUM(
            CASE 
              WHEN expiration_date IS NOT NULL AND expiration_date < CURDATE() THEN 1
              ELSE 0
            END
          ) AS expired_permits,
          SUM(
            CASE 
              WHEN expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
              THEN 1
              ELSE 0
            END
          ) AS expiring_30_days
        FROM permits
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Permit;