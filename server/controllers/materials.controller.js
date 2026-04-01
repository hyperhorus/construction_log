const Materials = require('../models/materials.model');

class MaterialsController {
  // Get all materials
  async getAll(req, res) {
    try {
      const { search, lowStock } = req.query;
      
      let materials;
      if (search) {
        materials = await Materials.search(search);
      } else if (lowStock) {
        materials = await Materials.findLowStock(parseInt(lowStock));
      } else {
        materials = await Materials.findAll();
      }
      
      res.json({
        success: true,
        count: materials.length,
        data: materials
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching materials',
        error: error.message
      });
    }
  }

  // Get material by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const material = await Materials.findById(id);
      
      if (!material) {
        return res.status(404).json({
          success: false,
          message: 'Material not found'
        });
      }
      
      res.json({
        success: true,
        data: material
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching material',
        error: error.message
      });
    }
  }

  // Create new material
  async create(req, res) {
    try {
      const { name, quantity, unit, unit_cost, supplier } = req.body;
      
      // Validation
      if (!name || quantity === undefined || !unit || unit_cost === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Name, quantity, unit, and unit_cost are required'
        });
      }

      const material = await Materials.create({
        name,
        quantity,
        unit,
        unit_cost,
        supplier
      });
      
      res.status(201).json({
        success: true,
        message: 'Material created successfully',
        data: material
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating material',
        error: error.message
      });
    }
  }

  // Update material
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, quantity, unit, unit_cost, supplier } = req.body;
      
      const existingMaterial = await Materials.findById(id);
      if (!existingMaterial) {
        return res.status(404).json({
          success: false,
          message: 'Material not found'
        });
      }

      const material = await Materials.update(id, {
        name,
        quantity,
        unit,
        unit_cost,
        supplier
      });
      
      res.json({
        success: true,
        message: 'Material updated successfully',
        data: material
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating material',
        error: error.message
      });
    }
  }
  
  // Update quantity
async updateQuantity(req, res) {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    // Validate operation
    if (operation && !['add', 'subtract', 'set'].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: 'Operation must be "add", "subtract", or "set"'
      });
    }

    const material = await Materials.updateQuantity(id, quantity, operation || 'set');
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Quantity updated successfully',
      data: material
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating quantity',
      error: error.message
    });
  }
}

  // Delete material
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Materials.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Material not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Material deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting material',
        error: error.message
      });
    }
  }

  // Get statistics
  async getStats(req, res) {
    try {
      const stats = await Materials.getStats();
      
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

module.exports = new MaterialsController();