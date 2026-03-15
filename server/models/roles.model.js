const db = require('../config/database');

class Role {
  // Get all roles (optional search)
  static async findAll() {
    try {
       const [rows] = await db.query(
        'SELECT * FROM roles WHERE 1=1'
      );
      return rows;      
    } catch (error) {
      throw error;
    }
  }

  // Get by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM roles WHERE role_id = ?',
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
      const { role_name } = data;

      const [result] = await db.query(
        'INSERT INTO roles (role_name) VALUES (?)',
        [role_name]
      );

      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update
  static async update(id, data) {
    try {
      const { role_name } = data;

      await db.query(
        'UPDATE roles SET role_name = ? WHERE role_id = ?',
        [role_name, id]
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
        'DELETE FROM roles WHERE role_id = ?',
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
          COUNT(*) AS total_roles
        FROM roles
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Role;