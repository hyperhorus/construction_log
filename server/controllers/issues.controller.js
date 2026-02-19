const Issue = require('../models/issues.model');

class IssuesController {
  // Get all issues (with optional filters)
  async getAll(req, res) {
    try {
      const {
        status,
        priority,
        project_id,
        assigned_to,
        start_date,
        end_date,
        search
      } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (project_id) filters.project_id = project_id;
      if (assigned_to) filters.assigned_to = assigned_to;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (search) filters.search = search;

      const issues = await Issue.findAll(filters);

      res.json({
        success: true,
        count: issues.length,
        data: issues
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching issues',
        error: error.message
      });
    }
  }

  // Get issue by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const issue = await Issue.findById(id);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
      }

      res.json({
        success: true,
        data: issue
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching issue',
        error: error.message
      });
    }
  }

  // Create new issue
  async create(req, res) {
    try {
      const {
        project_id,
        date_reported,
        description,
        status = 'open',
        priority = 'medium',
        assigned_to
      } = req.body;

      if (!project_id || !date_reported || !description) {
        return res.status(400).json({
          success: false,
          message: 'project_id, date_reported and description are required'
        });
      }

      const issue = await Issue.create({
        project_id,
        date_reported,
        description,
        status,
        priority,
        assigned_to
      });

      res.status(201).json({
        success: true,
        message: 'Issue created successfully',
        data: issue
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating issue',
        error: error.message
      });
    }
  }

  // Update issue
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        project_id,
        date_reported,
        description,
        status,
        priority,
        assigned_to
      } = req.body;

      const existingIssue = await Issue.findById(id);
      if (!existingIssue) {
        return res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
      }

      const issue = await Issue.update(id, {
        project_id,
        date_reported,
        description,
        status,
        priority,
        assigned_to
      });

      res.json({
        success: true,
        message: 'Issue updated successfully',
        data: issue
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating issue',
        error: error.message
      });
    }
  }

  // Delete issue
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Issue.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Issue not found'
        });
      }

      res.json({
        success: true,
        message: 'Issue deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting issue',
        error: error.message
      });
    }
  }

  // Get issues by project
  async getByProject(req, res) {
    try {
      const { projectId } = req.params;
      const issues = await Issue.findByProject(projectId);

      res.json({
        success: true,
        count: issues.length,
        data: issues
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching issues for project',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const stats = await Issue.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }
}

module.exports = new IssuesController();