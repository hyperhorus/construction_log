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

// PATCH - Update union_member field
async updateUnionMember(req, res) {
  try {
    const { id } = req.params;
    const { union_member } = req.body;

    // --- Step 1: Validate required field ---
    if (union_member === undefined) {
      return res.status(400).json({
        success: false,
        message: 'union_member is required'
      });
    }

    // --- Step 2: Validate tinyint value (0 or 1 only) ---
    if (![0, 1].includes(Number(union_member))) {
      return res.status(400).json({
        success: false,
        message: 'union_member must be 0 or 1'
      });
    }

     // --- Step 4: Call model method ---
    const existingWorker = await Worker.updateUnionMember(id, Number(union_member)); 
     // --- Step 3: Check if worker exists ---
    if (!existingWorker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }     

    // --- Step 5: Return response ---
    res.json({
      success: true,
      message: 'Union member status updated successfully',
      data: existingWorker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating union member status',
      error: error.message
    });
  }
}

// PATCH - Update name field
async updateName(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body; //el npmbre del campo debe ser el mismo que el de la tabla

    // --- Step 1: Validate required field ---
    //console.log("una prueba", name, req.body)
    if (name === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el nombre'
      });
    }

     // --- Step 4: Call model method ---
    const existingWorker = await Worker.updateName(id, name); 
     // --- Step 3: Check if worker exists ---
    if (!existingWorker) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }     

    // --- Step 5: Return response ---
    res.json({
      success: true,
      message: 'Nombre del trabajador actualizado',
      data: existingWorker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Actualizando al trabajador',
      error: error.message
    });
  }
}


// PATCH - Update role field
async updateRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body; //el npmbre del campo debe ser el mismo que el de la tabla

    // --- Step 1: Validate required field ---
    //console.log("una prueba", role, req.body)
    if (role === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el rol'
      });
    }

     // --- Step 4: Call model method ---
    const existingWorker = await Worker.updateRole(id, role); 
     // --- Step 3: Check if worker exists ---
    if (!existingWorker) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }     

    // --- Step 5: Return response ---
    res.json({
      success: true,
      message: 'Rol del trabajador actualizado',
      data: existingWorker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error Actualizando al trabajador',
      error: error.message
    });
  }
}


}

module.exports = new WorkersController();