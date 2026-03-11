const Worker = require('../models/workers.model');

class WorkersController {
  // Get all workers
  async getAll(req, res) {
    try {
      const { role, union_member, certification_level, search } = req.query;

      const filters = {};
      if (role) filters.role = role;
      if (certification_level) filters.certification_level = certification_level;
      if (search) filters.search = search;
      if (union_member !== undefined) {
        filters.union_member =
          union_member === 'true' || union_member === '1';
      }

      const workers = await Worker.findAll(filters);

      res.json({
        success: true,
        count: workers.length,
        data: workers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching workers',
        error: error.message,
      });
    }
  }

  // Get by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const worker = await Worker.findById(id);

      if (!worker) {
        return res.status(404).json({
          success: false,
          message: 'Worker not found',
        });
      }

      res.json({
        success: true,
        data: worker,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching worker',
        error: error.message,
      });
    }
  }

  // Create
  async create(req, res) {
    try {
      const {
        name,
        role,
        phone,
        email,
        certification_level,
        union_member = false,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required',
        });
      }

      const worker = await Worker.create({
        name,
        role,
        phone,
        email,
        certification_level,
        union_member,
      });

      res.status(201).json({
        success: true,
        message: 'Worker created successfully',
        data: worker,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating worker',
        error: error.message,
      });
    }
  }

  // Update
  async update(req, res) {
    try {
      const { id } = req.params;

      const existing = await Worker.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Worker not found',
        });
      }

      const {
        name,
        role,
        phone,
        email,
        certification_level,
        union_member,
      } = req.body;

      const worker = await Worker.update(id, {
        name: name ?? existing.name,
        role: role ?? existing.role,
        phone: phone ?? existing.phone,
        email: email ?? existing.email,
        certification_level: certification_level ?? existing.certification_level,
        union_member:
          union_member !== undefined ? union_member : existing.union_member,
      });

      res.json({
        success: true,
        message: 'Worker updated successfully',
        data: worker,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating worker',
        error: error.message,
      });
    }
  }

  // Delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Worker.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Worker not found',
        });
      }

      res.json({
        success: true,
        message: 'Worker deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting worker',
        error: error.message,
      });
    }
  }

  // Stats
  async getStats(req, res) {
    try {
      const stats = await Worker.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching worker statistics',
        error: error.message,
      });
    }
  }

  // Count by role
  async getCountByRole(req, res) {
    try {
      const data = await Worker.getCountByRole();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching workers by role',
        error: error.message,
      });
    }
  }
}

module.exports = new WorkersController();