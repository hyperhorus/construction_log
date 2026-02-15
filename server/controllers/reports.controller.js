const PDFService = require('../services/pdfService');
const DailyLogs = require('../models/dailyLogs.model');
const Equipment = require('../models/equipment.model');
const Materials = require('../models/materials.model');
const Inspections = require('../models/inspections.model');
const path = require('path');
const fs = require('fs');

class ReportsController {
  // Generate single daily log report
  async generateDailyLogReport(req, res) {
    try {
      const { id } = req.params;

      const log = await DailyLogs.findById(id);
      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Daily log not found'
        });
      }

      const reportsDir = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `daily-log-${id}-${Date.now()}.pdf`;
      const outputPath = path.join(reportsDir, filename);

      await PDFService.generateDailyLogReport(log, outputPath);

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Clean up file after download
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  }

  // Generate multiple daily logs report
  async generateDailyLogsReport(req, res) {
    try {
      const { start_date, end_date, project_id } = req.query;

      let logs;
      if (start_date && end_date) {
        logs = await DailyLogs.findByDateRange(start_date, end_date);
      } else if (project_id) {
        logs = await DailyLogs.findByProject(project_id);
      } else {
        logs = await DailyLogs.findAll();
      }

      if (logs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No logs found for the specified criteria'
        });
      }

      const reportsDir = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `daily-logs-report-${Date.now()}.pdf`;
      const outputPath = path.join(reportsDir, filename);

      await PDFService.generateMultipleDailyLogsReport(logs, outputPath, {
        startDate: start_date,
        endDate: end_date
      });

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  }

  // Generate equipment report
  async generateEquipmentReport(req, res) {
    try {
      const { status } = req.query;

      let equipment;
      if (status) {
        equipment = await Equipment.findByStatus(status);
      } else {
        equipment = await Equipment.findAll();
      }

      if (equipment.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No equipment found'
        });
      }

      const reportsDir = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `equipment-report-${Date.now()}.pdf`;
      const outputPath = path.join(reportsDir, filename);

      await PDFService.generateEquipmentReport(equipment, outputPath);

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  }

  // Generate materials report
  async generateMaterialsReport(req, res) {
    try {
      const materials = await Materials.findAll();

      if (materials.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No materials found'
        });
      }

      const reportsDir = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `materials-report-${Date.now()}.pdf`;
      const outputPath = path.join(reportsDir, filename);

      await PDFService.generateMaterialsReport(materials, outputPath);

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  }

  // Generate inspections report
  async generateInspectionsReport(req, res) {
    try {
      const inspections = await Inspections.findAll();

      if (inspections.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Inspections found'
        });
      }

      const reportsDir = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `inspections-report-${Date.now()}.pdf`;
      const outputPath = path.join(reportsDir, filename);

      await PDFService.generateInspectionsReport(inspections, outputPath);

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        fs.unlinkSync(outputPath);
      });
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating report',
        error: error.message
      });
    }
  }



}

module.exports = new ReportsController();