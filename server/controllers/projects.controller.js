const Project = require('../models/projects.model');

class ProjectsController {
  // Get all projects
  async getAll(req, res) {
    try {
      const { status, type, client_name, location } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (type) filters.type = type;
      if (client_name) filters.client_name = client_name;
      if (location) filters.location = location;

      let projects;
      if (Object.keys(filters).length > 0) {
        projects = await Project.findAll(filters);
      } else {
        projects = await Project.findAll();
      }
      
      res.json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching projects',
        error: error.message
      });
    }
  }

  // Get project by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching project',
        error: error.message
      });
    }
  }

  // Create new project
  async create(req, res) {
    try {
      const {
        name,
        type,
        location,
        start_date,
        end_date,
        status = 'planned',
        budget,
        client_name,
        compliance_level = 'basic',
        bim_model_link
      } = req.body;
      
      // Validation
      if (!name || !type || !location || !start_date) {
        return res.status(400).json({
          success: false,
          message: 'Name, type, location, and start_date are required'
        });
      }

      const project = await Project.create({
        name,
        type,
        location,
        start_date,
        end_date,
        status,
        budget,
        client_name,
        compliance_level,
        bim_model_link
      });
      
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: error.message
      });
    }
  }

  // Update project
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        type,
        location,
        start_date,
        end_date,
        status,
        budget,
        client_name,
        compliance_level,
        bim_model_link
      } = req.body;
      
      const existingProject = await Project.findById(id);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const project = await Project.update(id, {
        name,
        type,
        location,
        start_date,
        end_date,
        status,
        budget,
        client_name,
        compliance_level,
        bim_model_link
      });
      
      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: error.message
      });
    }
  }

  // Delete project
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Project.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting project',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const stats = await Project.getStats();
      
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

  // Get projects by status
  async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const projects = await Project.findByStatus(status);
      
      res.json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching projects by status',
        error: error.message
      });
    }
  }

  // Get projects count by type
  async getCountByType(req, res) {
    try {
      const counts = await Project.getCountByType();
      
      res.json({
        success: true,
        data: counts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching project type counts',
        error: error.message
      });
    }
  }
}

module.exports = new ProjectsController();