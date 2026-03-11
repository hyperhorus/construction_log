const Document = require('../models/documents.model');

class DocumentsController {
  async getAll(req, res) {
    try {
      const {
        project_id,
        doc_type,
        uploaded_by,
        version,
        gov_required,
        start_date,
        end_date,
      } = req.query;

      const filters = {};
      if (project_id) filters.project_id = project_id;
      if (doc_type) filters.doc_type = doc_type;
      if (uploaded_by) filters.uploaded_by = uploaded_by;
      if (version) filters.version = version;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (gov_required !== undefined) {
        filters.gov_required =
          gov_required === 'true' || gov_required === '1';
      }

      const documents = await Document.findAll(filters);

      res.json({
        success: true,
        count: documents.length,
        data: documents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching documents',
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const document = await Document.findById(id);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found',
        });
      }

      res.json({
        success: true,
        data: document,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching document',
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const {
        project_id,
        doc_type,
        version,
        file_path,
        uploaded_by,
        upload_date,
        gov_required = false,
      } = req.body;

      if (!project_id || !doc_type || !file_path) {
        return res.status(400).json({
          success: false,
          message: 'project_id, doc_type and file_path are required',
        });
      }

      const document = await Document.create({
        project_id,
        doc_type,
        version,
        file_path,
        uploaded_by,
        upload_date,
        gov_required,
      });

      res.status(201).json({
        success: true,
        message: 'Document created successfully',
        data: document,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating document',
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Document.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Document not found',
        });
      }

      const {
        project_id,
        doc_type,
        version,
        file_path,
        uploaded_by,
        upload_date,
        gov_required,
      } = req.body;

      const document = await Document.update(id, {
        project_id: project_id ?? existing.project_id,
        doc_type: doc_type ?? existing.doc_type,
        version: version ?? existing.version,
        file_path: file_path ?? existing.file_path,
        uploaded_by: uploaded_by ?? existing.uploaded_by,
        upload_date: upload_date ?? existing.upload_date,
        gov_required:
          gov_required !== undefined ? gov_required : existing.gov_required,
      });

      res.json({
        success: true,
        message: 'Document updated successfully',
        data: document,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating document',
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Document.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Document not found',
        });
      }

      res.json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting document',
        error: error.message,
      });
    }
  }

  async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const documents = await Document.findByProject(projectId);

      res.json({
        success: true,
        count: documents.length,
        data: documents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching documents for project',
        error: error.message,
      });
    }
  }

  async getByType(req, res) {
    try {
      const { type } = req.params;
      const documents = await Document.findByType(type);

      res.json({
        success: true,
        count: documents.length,
        data: documents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching documents by type',
        error: error.message,
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await Document.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching document statistics',
        error: error.message,
      });
    }
  }

  async getDocTypeCounts(req, res) {
    try {
      const counts = await Document.getDocTypeCounts();

      res.json({
        success: true,
        data: counts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching document type counts',
        error: error.message,
      });
    }
  }
}

module.exports = new DocumentsController();