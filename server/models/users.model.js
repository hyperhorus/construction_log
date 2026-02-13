const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Users {
  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT user_id, username, email, full_name, role, is_active, created_at, last_login FROM Users WHERE user_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { username, email, password, full_name, role } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await db.query(
        'INSERT INTO Users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name || null, role || 'worker']
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      await db.query(
        'UPDATE Users SET last_login = NOW() WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Get all users (without passwords)
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT user_id, username, email, full_name, role, is_active, created_at, last_login FROM Users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      const { email, full_name, role, is_active } = userData;
      
      await db.query(
        'UPDATE Users SET email = ?, full_name = ?, role = ?, is_active = ? WHERE user_id = ?',
        [email, full_name, role, is_active, id]
      );
      
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await db.query(
        'UPDATE Users SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Users WHERE user_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Users;