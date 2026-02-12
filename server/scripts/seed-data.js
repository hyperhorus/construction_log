const {
  equipmentAPI,
  materialsAPI,
  inspectionsAPI,
  subcontractorsAPI,
  photosAPI,
  timeTrackingAPI,
} = require('../config/database');

async function seedData() {
  try {
    console.log('🌱 Seeding database...\n');

    // Equipment
    console.log('Adding equipment...');
    await db.query(`
      INSERT INTO Equipment (name, type, status, last_maintenance) VALUES
      ('Excavator CAT 320', 'Heavy Machinery', 'Available', '2024-01-15'),
      ('Concrete Mixer', 'Mixing Equipment', 'In Use', '2024-02-01'),
      ('Bulldozer D6', 'Heavy Machinery', 'Maintenance', '2024-01-20'),
      ('Tower Crane', 'Lifting Equipment', 'In Use', '2024-01-10'),
      ('Dump Truck', 'Transportation', 'Available', '2024-01-25')
    `);

    // Materials
    console.log('Adding materials...');
    await db.query(`
      INSERT INTO Materials (name, quantity, unit, unit_cost, supplier) VALUES
      ('Portland Cement', 100, 'bags', 12.50, 'ABC Building Supplies'),
      ('Steel Rebar #4', 500, 'pieces', 8.75, 'Metal Works Inc'),
      ('Concrete Blocks', 1000, 'units', 2.50, 'ABC Building Supplies'),
      ('Sand', 50, 'tons', 35.00, 'Aggregate Supply Co'),
      ('Gravel', 75, 'tons', 40.00, 'Aggregate Supply Co')
    `);

    // Inspections
    console.log('Adding inspections...');
    await db.query(`
      INSERT INTO Inspections (project_id, date, type, inspector, result, notes) VALUES
      (1, '2024-02-08', 'Safety Inspection', 'John Smith', 'Passed', 'All safety protocols followed'),
      (1, '2024-02-07', 'Quality Inspection', 'Jane Doe', 'Conditional', 'Minor issues with concrete finish'),
      (1, '2024-02-06', 'Structural Inspection', 'Mike Johnson', 'Passed', 'Foundation meets specifications'),
      (2, '2024-02-05', 'Safety Inspection', 'John Smith', 'Failed', 'Missing safety barriers'),
      (2, '2024-02-08', 'Re-inspection', 'John Smith', 'Passed', 'All issues resolved')
    `);

    // Subcontractors
    console.log('Adding subcontractors...');
    await db.query(`
      INSERT INTO Subcontractors (company_name, specialty, contact_info, insurance_exp) VALUES
      ('Smith Electrical Services', 'Electrical', '{"phone": "555-1234", "email": "info@smithelectrical.com"}', '2024-12-31'),
      ('Pro Plumbing Inc', 'Plumbing', '{"phone": "555-5678", "email": "contact@proplumbing.com"}', '2024-11-30'),
      ('HVAC Masters', 'HVAC', '{"phone": "555-9012", "email": "service@hvacmasters.com"}', '2024-10-15'),
      ('Steel Frame Specialists', 'Structural Steel', '{"phone": "555-3456", "email": "info@steelframe.com"}', '2025-01-31')
    `);

    // Photos
    console.log('Adding photos...');
    await db.query(`
      INSERT INTO Photos (log_id, file_path, description) VALUES
      (1, '/uploads/photos/project1_001.jpg', 'Foundation work completed'),
      (1, '/uploads/photos/project1_002.jpg', 'Steel framework installation'),
      (1, '/uploads/photos/project1_003.jpg', 'Concrete pouring - North section'),
      (2, '/uploads/photos/project2_001.jpg', 'Site preparation'),
      (2, '/uploads/photos/project2_002.jpg', 'Excavation progress')
    `);

    // Time Tracking
    console.log('Adding time tracking entries...');
    await db.query(`
      INSERT INTO Time_Tracking (worker_id, project_id, date, hours_worked, overtime_hours) VALUES
      (1, 1, '2024-02-08', 8, 2),
      (2, 1, '2024-02-08', 8, 0),
      (3, 1, '2024-02-08', 8, 1),
      (1, 1, '2024-02-07', 8, 3),
      (2, 1, '2024-02-07', 8, 0),
      (4, 2, '2024-02-08', 8, 0),
      (5, 2, '2024-02-08', 8, 1)
    `);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

const db = require('../config/database');
seedData();