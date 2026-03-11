const SafetyIncident = require('../models/safetyIncidents.model');

class SafetyIncidentsController {
  // Get all incidents
  async getAll(req, res) {
    try {
      const {
        project_id,
        severity,
        osha_reportable,
        start_date,
        end_date,
        type,
      } = req.query;

      const filters = {};
      if (project_id) filters.project_id = project_id;
      if (severity) filters.severity = severity;
      if (type) filters.type = type;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (osha_reportable !== undefined) {
        filters.osha_reportable =
          osha_reportable === 'true' || osha_reportable === '1';
      }

      const incidents = await SafetyIncident.findAll(filters);

      res.json({
        success: true,
        count: incidents.length,
        data: incidents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching safety incidents',
        error: error.message,
      });
    }
  }

  // Get incident by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const incident = await SafetyIncident.findById(id);

      if (!incident) {
        return res.status(404).json({
          success: false,
          message: 'Safety incident not found',
        });
      }

      res.json({
        success: true,
        data: incident,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching safety incident',
        error: error.message,
      });
    }
  }

  // Create incident
  async create(req, res) {
    try {
      const {
        project_id,
        date,
        type,
        severity = 'medium',
        injured_person,
        osha_reportable = false,
        corrective_actions,
      } = req.body;

      if (!project_id || !date || !type || !severity) {
        return res.status(400).json({
          success: false,
          message: 'project_id, date, type and severity are required',
        });
      }

      const incident = await SafetyIncident.create({
        project_id,
        date,
        type,
        severity,
        injured_person,
        osha_reportable,
        corrective_actions,
      });

      res.status(201).json({
        success: true,
        message: 'Safety incident created successfully',
        data: incident,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating safety incident',
        error: error.message,
      });
    }
  }

  // Update incident
  async update(req, res) {
    try {
      const { id } = req.params;

      const existing = await SafetyIncident.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Safety incident not found',
        });
      }

      const {
        project_id,
        date,
        type,
        severity,
        injured_person,
        osha_reportable,
        corrective_actions,
      } = req.body;

      const incident = await SafetyIncident.update(id, {
        project_id: project_id ?? existing.project_id,
        date: date ?? existing.date,
        type: type ?? existing.type,
        severity: severity ?? existing.severity,
        injured_person: injured_person ?? existing.injured_person,
        osha_reportable:
          osha_reportable !== undefined
            ? osha_reportable
            : existing.osha_reportable,
        corrective_actions:
          corrective_actions ?? existing.corrective_actions,
      });

      res.json({
        success: true,
        message: 'Safety incident updated successfully',
        data: incident,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating safety incident',
        error: error.message,
      });
    }
  }

  // Delete incident
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await SafetyIncident.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Safety incident not found',
        });
      }

      res.json({
        success: true,
        message: 'Safety incident deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting safety incident',
        error: error.message,
      });
    }
  }

  // Get incidents by project
  async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const incidents = await SafetyIncident.findByProject(projectId);

      res.json({
        success: true,
        count: incidents.length,
        data: incidents,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching incidents for project',
        error: error.message,
      });
    }
  }

  // Stats
  async getStats(req, res) {
    try {
      const stats = await SafetyIncident.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching safety incident statistics',
        error: error.message,
      });
    }
  }
}

module.exports = new SafetyIncidentsController();