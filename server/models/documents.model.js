const db = require('../config/database');

class Document {
  // Get all documents with optional filters
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          d.*,
          p.name AS project_name
        FROM documents d
        LEFT JOIN projects p ON d.project_id = p.project_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.project_id) {
        query += ' AND d.project_id = ?';
        params.push(filters.project_id);
      }

      if (filters.doc_type) {
        query += ' AND d.doc_type LIKE ?';
        params.push(`%${filters.doc_type}%`);
      }

      if (filters.uploaded_by) {
        query += ' AND d.uploaded_by LIKE ?';
        params.push(`%${filters.uploaded_by}%`);
      }

      if (filters.version) {
        query += ' AND d.version LIKE ?';
        params.push(`%${filters.version}%`);
      }

      if (filters.gov_required !== undefined) {
        query += ' AND d.gov_required = ?';
        params.push(filters.gov_required ? 1 : 0);
      }

      if (filters.start_date) {
        query += ' AND DATE(d.upload_date) >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ' AND DATE(d.upload_date) <= ?';
        params.push(filters.end_date);
      }

      query += ' ORDER BY d.upload_date DESC';

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
          d.*,
          p.name AS project_name
        FROM documents d
        LEFT JOIN projects p ON d.project_id = p.project_id
        WHERE d.document_id = ?
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
        doc_type,
        version,
        file_path,
        uploaded_by,
        upload_date,
        gov_required,
      } = data;

      const [result] = await db.query(
        `
        INSERT INTO documents
          (project_id, doc_type, version, file_path, uploaded_by, upload_date, gov_required)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          project_id,
          doc_type,
          version || null,
          file_path,
          uploaded_by || null,
          upload_date || new Date(),
          gov_required ? 1 : 0,
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
        doc_type,
        version,
        file_path,
        uploaded_by,
        upload_date,
        gov_required,
      } = data;

      await db.query(
        `
        UPDATE documents SET
          project_id = ?,
          doc_type = ?,
          version = ?,
          file_path = ?,
          uploaded_by = ?,
          upload_date = ?,
          gov_required = ?
        WHERE document_id = ?
        `,
        [
          project_id,
          doc_type,
          version || null,
          file_path,
          uploaded_by || null,
          upload_date || new Date(),
          gov_required ? 1 : 0,
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
        'DELETE FROM documents WHERE document_id = ?',
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
          d.*,
          p.name AS project_name
        FROM documents d
        LEFT JOIN projects p ON d.project_id = p.project_id
        WHERE d.project_id = ?
        ORDER BY d.upload_date DESC
        `,
        [project_id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search by document type
  static async findByType(doc_type) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          d.*,
          p.name AS project_name
        FROM documents d
        LEFT JOIN projects p ON d.project_id = p.project_id
        WHERE d.doc_type LIKE ?
        ORDER BY d.upload_date DESC
        `,
        [`%${doc_type}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Stats
  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT
          COUNT(*) AS total_documents,
          COUNT(DISTINCT project_id) AS projects_with_docs,
          COUNT(DISTINCT doc_type) AS unique_doc_types,
          SUM(CASE WHEN gov_required = 1 THEN 1 ELSE 0 END) AS gov_required_count,
          COUNT(DISTINCT uploaded_by) AS unique_uploaders
        FROM documents
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get document types with counts
  static async getDocTypeCounts() {
    try {
      const [rows] = await db.query(`
        SELECT 
          doc_type,
          COUNT(*) as count,
          SUM(CASE WHEN gov_required = 1 THEN 1 ELSE 0 END) as gov_required_count
        FROM documents 
        GROUP BY doc_type
        ORDER BY count DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Document;