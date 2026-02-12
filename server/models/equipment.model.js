const db = require('../config/database');

class Equipment {
  // Get all equipment
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Equipment ORDER BY last_maintenance DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get equipment by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Equipment WHERE equipment_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get equipment by status
  static async findByStatus(status) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Equipment WHERE status = ? ORDER BY name',
        [status]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new equipment
  static async create(equipmentData) {
    try {
      const { name, type, status, last_maintenance } = equipmentData;
      const [result] = await db.query(
        'INSERT INTO Equipment (name, type, status, last_maintenance) VALUES (?, ?, ?, ?)',
        [name, type, status || 'Available', last_maintenance || null]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update equipment
  static async update(id, equipmentData) {
    try {
      const { name, type, status, last_maintenance } = equipmentData;
      await db.query(
        'UPDATE Equipment SET name = ?, type = ?, status = ?, last_maintenance = ? WHERE equipment_id = ?',
        [name, type, status, last_maintenance, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete equipment
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Equipment WHERE equipment_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get equipment statistics
  static async getStats() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) as available,
          SUM(CASE WHEN status = 'In Use' THEN 1 ELSE 0 END) as in_use,
          SUM(CASE WHEN status = 'Maintenance' THEN 1 ELSE 0 END) as maintenance,
          SUM(CASE WHEN status = 'Retired' THEN 1 ELSE 0 END) as retired
        FROM Equipment
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Equipment;