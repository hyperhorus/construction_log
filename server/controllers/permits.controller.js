const Permit = require('../models/permits.model');

class PermitsController {
  async getAll(req, res) {
    try {
      const {
        project_id,
        permit_type,
        issuing_authority,
        start_date,
        end_date,
      } = req.query;

      const filters = {};
      if (project_id) filters.project_id = project_id;
      if (permit_type) filters.permit_type = permit_type;
      if (issuing_authority) filters.issuing_authority = issuing_authority;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;

      const permits = await Permit.findAll(filters);

      res.json({
        success: true,
        count: permits.length,
        data: permits,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching permits',
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const permit = await Permit.findById(id);

      if (!permit) {
        return res.status(404).json({
          success: false,
          message: 'Permit not found',
        });
      }

      res.json({
        success: true,
        data: permit,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching permit',
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const {
        project_id,
        permit_type,
        issuing_authority,
        issue_date,
        expiration_date,
        approved_by,
      } = req.body;

      if (!project_id || !permit_type || !issuing_authority || !issue_date) {
        return res.status(400).json({
          success: false,
          message:
            'project_id, permit_type, issuing_authority and issue_date are required',
        });
      }

      const permit = await Permit.create({
        project_id,
        permit_type,
        issuing_authority,
        issue_date,
        expiration_date,
        approved_by,
      });

      res.status(201).json({
        success: true,
        message: 'Permit created successfully',
        data: permit,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating permit',
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Permit.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Permit not found',
        });
      }

      const {
        project_id,
        permit_type,
        issuing_authority,
        issue_date,
        expiration_date,
        approved_by,
      } = req.body;

      const permit = await Permit.update(id, {
        project_id: project_id ?? existing.project_id,
        permit_type: permit_type ?? existing.permit_type,
        issuing_authority: issuing_authority ?? existing.issuing_authority,
        issue_date: issue_date ?? existing.issue_date,
        expiration_date: expiration_date ?? existing.expiration_date,
        approved_by: approved_by ?? existing.approved_by,
      });

      res.json({
        success: true,
        message: 'Permit updated successfully',
        data: permit,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating permit',
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Permit.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Permit not found',
        });
      }

      res.json({
        success: true,
        message: 'Permit deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting permit',
        error: error.message,
      });
    }
  }

  async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const permits = await Permit.findByProject(projectId);

      res.json({
        success: true,
        count: permits.length,
        data: permits,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching permits for project',
        error: error.message,
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await Permit.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching permit statistics',
        error: error.message,
      });
    }
  }
}

module.exports = new PermitsController();