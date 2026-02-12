const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create connection without database selected
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

const DB_NAME = process.env.DB_NAME || 'construction_log';

async function setupDatabase() {
  try {
    // Create database if it doesn't exist
    console.log(`📦 Creating database: ${DB_NAME}...`);
    await connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`✅ Database ${DB_NAME} ready`);

    // Use the database
    await connection.promise().query(`USE ${DB_NAME}`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating tables...');
    await connection.promise().query(schema);
    console.log('✅ All tables created successfully');

    console.log('\n🎉 Database setup complete!\n');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    connection.end();
  }
}

setupDatabase();