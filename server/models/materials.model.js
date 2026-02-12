const db = require('../config/database');

class Material {

  // Get all materials  
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Materials ORDER BY name DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get material by ID  
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Materials WHERE material_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Search materials by name  
  static async searchByName(name) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Materials WHERE name LIKE ?',
        [`%${name}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Create new material  
  static async create(materialData) {
    try {
      const { name, quantity, unit, unit_cost, supplier } = materialData;
      const [result] = await db.query(
        'INSERT INTO Materials (name, quantity, unit, unit_cost, supplier) VALUES (?, ?, ?, ?, ?)',
        [name, quantity, unit, unit_cost, supplier]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update material  
  static async update(id, materialData) {
    try {
      const { name, quantity, unit, unit_cost, supplier } = materialData;
      await db.query(
        'UPDATE Materials SET name = ?, quantity = ?, unit = ?, unit_cost = ?, supplier = ? WHERE material_id = ?',
        [name, quantity, unit, unit_cost, supplier, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete material  
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM Materials WHERE material_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get inventory value  
  static async getInventoryValue() {
    try {
      const [result] = await db.query(`
        SELECT 
          SUM(quantity * unit_cost) AS total_value FROM Materials  `);
      return result[0];
    } catch (error) {
      throw error;
    }
  }
// Update quantity (for stock management)
static async updateQuantity(id, quantity, operation = 'set') {
  try {
    let query;
    const params = [quantity, id];
    
    if (operation === 'add') {
      query = 'UPDATE Materials SET quantity = quantity + ? WHERE material_id = ?';
    } else if (operation === 'subtract') {
      query = 'UPDATE Materials SET quantity = GREATEST(0, quantity - ?) WHERE material_id = ?';
    } else {
      query = 'UPDATE Materials SET quantity = ? WHERE material_id = ?';
    }
    
    const [result] = await db.query(query, params);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return this.findById(id);
  } catch (error) {
    throw error;
  }
}
  
}


module.exports = Material;