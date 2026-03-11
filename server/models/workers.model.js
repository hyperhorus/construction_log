const db = require('../config/database');

class Worker {
  // Get all workers (with optional filters)
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM workers WHERE 1=1';
      const params = [];

      if (filters.role) {
        query += ' AND role LIKE ?';
        params.push(`%${filters.role}%`);
      }

      if (filters.union_member !== undefined) {
        query += ' AND union_member = ?';
        params.push(filters.union_member ? 1 : 0);
      }

      if (filters.certification_level) {
        query += ' AND certification_level LIKE ?';
        params.push(`%${filters.certification_level}%`);
      }

      if (filters.search) {
        query += ' AND name LIKE ?';
        params.push(`%${filters.search}%`);
      }

      query += ' ORDER BY name ASC';

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
        'SELECT * FROM workers WHERE worker_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Search by name
  static async searchByName(name) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM workers WHERE name LIKE ? ORDER BY name ASC',
        [`%${name}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create
  static async create(data) {
    try {
      const {
        name,
        role,
        phone,
        email,
        certification_level,
        union_member,
      } = data;

      const [result] = await db.query(
        `
        INSERT INTO workers
          (name, role, phone, email, certification_level, union_member)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          name,
          role || null,
          phone || null,
          email || null,
          certification_level || null,
          union_member ? 1 : 0,
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
        name,
        role,
        phone,
        email,
        certification_level,
        union_member,
      } = data;

      await db.query(
        `
        UPDATE workers SET
          name = ?,
          role = ?,
          phone = ?,
          email = ?,
          certification_level = ?,
          union_member = ?
        WHERE worker_id = ?
        `,
        [
          name,
          role || null,
          phone || null,
          email || null,
          certification_level || null,
          union_member ? 1 : 0,
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
        'DELETE FROM workers WHERE worker_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Stats
  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT
          COUNT(*) AS total_workers,
          SUM(CASE WHEN union_member = 1 THEN 1 ELSE 0 END) AS union_members,
          COUNT(DISTINCT role) AS distinct_roles,
          COUNT(DISTINCT certification_level) AS distinct_certifications
        FROM workers
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Group by role
  static async getCountByRole() {
    try {
      const [rows] = await db.query(`
        SELECT
          role,
          COUNT(*) AS count
        FROM workers
        GROUP BY role
        ORDER BY count DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Worker;