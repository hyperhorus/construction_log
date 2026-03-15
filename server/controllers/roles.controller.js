const Role = require('../models/roles.model');

class RolesController {
  // Get all roles
  // async getAll(req, res) {
  //   try {
  //     console.log('🔎 rolesController.getAll called'); // add this
  //     const { search } = req.query;
  //     const filters = {};
  //     if (search) filters.search = search;

  //     const roles = await Role.findAll(filters);

  //     res.json({
  //       success: true,
  //       count: roles.length,
  //       data: roles,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: 'Error fetching roles',
  //       error: error.message,
  //     });
  //   }
  // }

// controllers/roles.controller.js
async getAll(req, res) {
  try {
    console.log('🔎 rolesController.getAll called'); // add this
    const { search } = req.query;
    
    const filters = {};
    if (search) filters.search = search;

    const roles = await Role.findAll(filters);
    console.log(roles)
    res.json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    console.error('Error in getAll roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message,
    });
  }
}


  // Get by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);

      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }

      res.json({
        success: true,
        data: role,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching role',
        error: error.message,
      });
    }
  }

  // Create
  async create(req, res) {
    try {
      const { role_name } = req.body;

      if (!role_name) {
        return res.status(400).json({
          success: false,
          message: 'role_name is required',
        });
      }

      const role = await Role.create({ role_name });

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating role',
        error: error.message,
      });
    }
  }

  // Update
  async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await Role.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }

      const { role_name } = req.body;

      const role = await Role.update(id, {
        role_name: role_name ?? existing.role_name,
      });

      res.json({
        success: true,
        message: 'Role updated successfully',
        data: role,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating role',
        error: error.message,
      });
    }
  }

  // Delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Role.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }

      res.json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting role',
        error: error.message,
      });
    }
  }

  // Stats
  async getStats(req, res) {
    try {
      const stats = await Role.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching role statistics',
        error: error.message,
      });
    }
  }
}

module.exports = new RolesController();