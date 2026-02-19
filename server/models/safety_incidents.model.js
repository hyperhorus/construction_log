const db = require('../config/database');

class SafetyIncident {
  // Get all incidents with optional filters
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          si.*,
          p.name AS project_name
        FROM safety_incidents si
        LEFT JOIN projects p ON si.project_id = p.project_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.project_id) {
        query += ' AND si.project_id = ?';
        params.push(filters.project_id);
      }

      if (filters.severity) {
        query += ' AND si.severity = ?';
        params.push(filters.severity);
      }

      if (filters.osha_reportable !== undefined) {
        query += ' AND si.osha_reportable = ?';
        params.push(filters.osha_reportable ? 1 : 0);
      }

      if (filters.start_date) {
        query += ' AND si.date >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ' AND si.date <= ?';
        params.push(filters.end_date);
      }

      if (filters.type) {
        query += ' AND si.type LIKE ?';
        params.push(`%${filters.type}%`);
      }

      query += ' ORDER BY si.date DESC, si.severity DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get incident by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          si.*,
          p.name AS project_name
        FROM safety_incidents si
        LEFT JOIN projects p ON si.project_id = p.project_id
        WHERE si.incident_id = ?
        `,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new incident
  static async create(data) {
    try {
      const {
        project_id,
        date,
        type,
        severity,
        injured_person,
        osha_reportable,
        corrective_actions,
      } = data;

      const [result] = await db.query(
        `
        INSERT INTO safety_incidents
          (project_id, date, type, severity, injured_person, osha_reportable, corrective_actions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          project_id,
          date,
          type,
          severity,
          injured_person || null,
          osha_reportable ? 1 : 0,
          corrective_actions || null,
        ]
      );

      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Update incident
  static async update(id, data) {
    try {
      const {
        project_id,
        date,
        type,
        severity,
        injured_person,
        osha_reportable,
        corrective_actions,
      } = data;

      await db.query(
        `
        UPDATE safety_incidents SET
          project_id = ?,
          date = ?,
          type = ?,
          severity = ?,
          injured_person = ?,
          osha_reportable = ?,
          corrective_actions = ?
        WHERE incident_id = ?
        `,
        [
          project_id,
          date,
          type,
          severity,
          injured_person || null,
          osha_reportable ? 1 : 0,
          corrective_actions || null,
          id,
        ]
      );

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete incident
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM safety_incidents WHERE incident_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get incidents by project
  static async findByProject(project_id) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          si.*,
          p.name AS project_name
        FROM safety_incidents si
        LEFT JOIN projects p ON si.project_id = p.project_id
        WHERE si.project_id = ?
        ORDER BY si.date DESC, si.severity DESC
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
          COUNT(*) AS total_incidents,
          SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) AS low_severity,
          SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) AS medium_severity,
          SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) AS high_severity,
          SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) AS critical_severity,
          SUM(CASE WHEN osha_reportable = 1 THEN 1 ELSE 0 END) AS osha_reportable_count
        FROM safety_incidents
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SafetyIncident;