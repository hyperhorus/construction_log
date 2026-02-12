const db = require('../config/database');

class Photos {
  // Get all photos
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Photos ORDER BY timestamp DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get photo by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Photos WHERE photo_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get photos by log
  static async findByLog(logId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Photos WHERE log_id = ? ORDER BY timestamp DESC',
        [logId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get photos by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Photos WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new photo record
  static async create(photoData) {
    try {
      const { log_id, file_path, description, timestamp } = photoData;
      const [result] = await db.query(
        'INSERT INTO Photos (log_id, file_path, description, time_captured) VALUES (?, ?, ?, ?)',
        [log_id, file_path, description || null, timestamp || new Date()]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update photo
  static async update(id, photoData) {
    try {
      const { log_id, file_path, description } = photoData;
      await db.query(
        'UPDATE Photos SET log_id = ?, file_path = ?, description = ? WHERE photo_id = ?',
        [log_id, file_path, description, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete photo
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Photos WHERE photo_id = ?',
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
          COUNT(*) as total_photos,
          COUNT(DISTINCT log_id) as logs_with_photos,
          DATE(MIN(timestamp)) as first_photo_date,
          DATE(MAX(timestamp)) as latest_photo_date
        FROM Photos
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  // Get count by log
  static async getCountByLog(logId) {
    try {
      const [result] = await db.query(
        'SELECT COUNT(*) as count FROM Photos WHERE log_id = ?',
        [logId]
      );
      return result[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Photos;