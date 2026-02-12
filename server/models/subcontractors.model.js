const db = require('../config/database');

class Subcontractors {
  // Get all subcontractors
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Subcontractors ORDER BY company_name'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get subcontractor by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Subcontractors WHERE subcontractor_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Search by specialty
  static async findBySpecialty(specialty) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Subcontractors WHERE specialty LIKE ? ORDER BY company_name',
        [`%${specialty}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get subcontractors with expired insurance
  static async findExpiredInsurance() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Subcontractors WHERE insurance_exp < CURDATE() ORDER BY insurance_exp'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get subcontractors with insurance expiring soon
  static async findExpiringInsurance(days = 30) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Subcontractors WHERE insurance_exp BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) ORDER BY insurance_exp',
        [days]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new subcontractor
  static async create(subcontractorData) {
    try {
      const { company_name, specialty, contact_info, insurance_exp } = subcontractorData;
      const contactInfoJson = typeof contact_info === 'string' ? contact_info : JSON.stringify(contact_info);
      
      const [result] = await db.query(
        'INSERT INTO Subcontractors (company_name, specialty, contact_info, insurance_expiration) VALUES (?, ?, ?, ?)',
        [company_name, specialty, contactInfoJson, insurance_exp || null]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update subcontractor
  static async update(id, subcontractorData) {
    try {
      const { company_name, specialty, contact_info, insurance_exp } = subcontractorData;
      const contactInfoJson = typeof contact_info === 'string' ? contact_info : JSON.stringify(contact_info);
      
      await db.query(
        'UPDATE Subcontractors SET company_name = ?, specialty = ?, contact_info = ?, insurance_exp = ? WHERE subcontractor_id = ?',
        [company_name, specialty, contactInfoJson, insurance_exp, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete subcontractor
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Subcontractors WHERE subcontractor_id = ?',
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
          COUNT(*) as total,
          COUNT(DISTINCT specialty) as total_specialties,
          SUM(CASE WHEN insurance_exp < CURDATE() THEN 1 ELSE 0 END) as expired_insurance,
          SUM(CASE WHEN insurance_exp BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as expiring_soon
        FROM Subcontractors
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Subcontractors;