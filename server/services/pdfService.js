const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  // Generate Daily Log Report
  static async generateDailyLogReport(log, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc
          .fontSize(20)
          .text('Daily Construction Log Report', { align: 'center' })
          .moveDown();

        // Logo/Title Section
        doc
          .fontSize(12)
          .text('Construction Log System', { align: 'center' })
          .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
          .moveDown(2);

        // Log Details
        doc
          .fontSize(16)
          .text('Log Information', { underline: true })
          .moveDown();

        const logDetails = [
          { label: 'Log ID', value: log.log_id },
          { label: 'Project ID', value: log.project_id || 'N/A' },
          { label: 'Date', value: new Date(log.date).toLocaleDateString() },
          { label: 'Weather', value: log.weather || 'N/A' },
          { label: 'Workers Count', value: log.workers_count || 'N/A' },
          { label: 'GPS Location', value: log.gps_location || 'N/A' },
        ];

        doc.fontSize(12);
        logDetails.forEach(item => {
          doc
            .font('Helvetica-Bold')
            .text(item.label + ': ', { continued: true })
            .font('Helvetica')
            .text(item.value)
            .moveDown(0.5);
        });

        doc.moveDown();

        // Work Performed
        if (log.work_performed) {
          doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Work Performed', { underline: true })
            .moveDown(0.5)
            .fontSize(12)
            .font('Helvetica')
            .text(log.work_performed, { align: 'justify' })
            .moveDown();
        }

        // Notes
        if (log.notes) {
          doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Notes', { underline: true })
            .moveDown(0.5)
            .fontSize(12)
            .font('Helvetica')
            .text(log.notes, { align: 'justify' })
            .moveDown();
        }

        // Footer
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(10)
            .text(
              `Page ${i + 1} of ${pageCount}`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate Multiple Daily Logs Report
  static async generateMultipleDailyLogsReport(logs, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc
          .fontSize(20)
          .text('Daily Logs Summary Report', { align: 'center' })
          .moveDown();

        doc
          .fontSize(12)
          .text('Construction Log System', { align: 'center' })
          .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
          .moveDown();

        // Filter info
        if (options.startDate && options.endDate) {
          doc
            .fontSize(12)
            .text(`Period: ${options.startDate} to ${options.endDate}`, { align: 'center' })
            .moveDown(2);
        }

        // Summary Statistics
        const totalWorkers = logs.reduce((sum, log) => sum + (log.workers_count || 0), 0);
        const avgWorkers = logs.length > 0 ? (totalWorkers / logs.length).toFixed(1) : 0;

        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Summary Statistics', { underline: true })
          .moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .text(`Total Logs: ${logs.length}`)
          .text(`Total Worker Days: ${totalWorkers}`)
          .text(`Average Workers per Day: ${avgWorkers}`)
          .moveDown(2);

        // Individual Logs
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Daily Logs', { underline: true })
          .moveDown();

        logs.forEach((log, index) => {
          if (index > 0) {
            doc.addPage();
          }

          doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`Log #${log.log_id} - ${new Date(log.date).toLocaleDateString()}`)
            .moveDown(0.5)
            .font('Helvetica');

          if (log.project_id) {
            doc.text(`Project: #${log.project_id}`);
          }
          if (log.weather) {
            doc.text(`Weather: ${log.weather}`);
          }
          if (log.workers_count) {
            doc.text(`Workers: ${log.workers_count}`);
          }

          doc.moveDown(0.5);

          if (log.work_performed) {
            doc
              .font('Helvetica-Bold')
              .text('Work Performed:', { continued: true })
              .font('Helvetica')
              .text(' ' + log.work_performed, { align: 'justify' });
            doc.moveDown(0.5);
          }

          if (log.notes) {
            doc
              .font('Helvetica-Bold')
              .text('Notes:', { continued: true })
              .font('Helvetica')
              .text(' ' + log.notes, { align: 'justify' });
          }

          doc.moveDown();
          doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown();
        });

        // Footer
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(10)
            .text(
              `Page ${i + 1} of ${pageCount}`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );
        }

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate Equipment Report
  static async generateEquipmentReport(equipment, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc
          .fontSize(20)
          .text('Equipment Inventory Report', { align: 'center' })
          .moveDown();

        doc
          .fontSize(12)
          .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
          .moveDown(2);

        // Summary
        const statusCounts = equipment.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Summary', { underline: true })
          .moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .text(`Total Equipment: ${equipment.length}`)
          .moveDown(0.5);

        Object.entries(statusCounts).forEach(([status, count]) => {
          doc.text(`${status}: ${count}`);
        });

        doc.moveDown(2);

        // Equipment Table Header
        const tableTop = doc.y;
        const colWidths = { name: 200, type: 150, status: 100, maintenance: 100 };
        
        doc
          .fontSize(12)
          .font('Helvetica-Bold');

        doc.text('Name', 50, tableTop, { width: colWidths.name });
        doc.text('Type', 250, tableTop, { width: colWidths.type });
        doc.text('Status', 400, tableTop, { width: colWidths.status });
        doc.text('Last Maintenance', 450, tableTop, { width: colWidths.maintenance });

        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        // Equipment Rows
        doc.font('Helvetica').fontSize(10);

        equipment.forEach((item, index) => {
          const y = doc.y;

          if (y > 700) {
            doc.addPage();
            doc.moveDown();
          }

          doc.text(item.name, 50, doc.y, { width: colWidths.name });
          doc.text(item.type, 250, y, { width: colWidths.type });
          doc.text(item.status, 400, y, { width: colWidths.status });
          doc.text(
            item.last_maintenance 
              ? new Date(item.last_maintenance).toLocaleDateString() 
              : 'N/A',
            450,
            y,
            { width: colWidths.maintenance }
          );

          doc.moveDown();
          doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown(0.5);
        });

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate Materials Report
  static async generateMaterialsReport(materials, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc
          .fontSize(20)
          .text('Materials Inventory Report', { align: 'center' })
          .moveDown();

        doc
          .fontSize(12)
          .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
          .moveDown(2);

        // Summary
        const totalValue = materials.reduce(
          (sum, item) => sum + (item.quantity * item.unit_cost),
          0
        );

        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Summary', { underline: true })
          .moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .text(`Total Items: ${materials.length}`)
          .text(`Total Inventory Value: 
$$
{totalValue.toFixed(2)}`)
          .moveDown(2);

        // Table Header
        const tableTop = doc.y;
        
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Name', 50, tableTop, { width: 150 });
        doc.text('Quantity', 210, tableTop, { width: 80 });
        doc.text('Unit', 300, tableTop, { width: 80 });
        doc.text('Unit Cost', 390, tableTop, { width: 80 });
        doc.text('Total Value', 480, tableTop, { width: 100 });
        doc.text('Supplier', 590, tableTop, { width: 150 });

        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(750, doc.y).stroke();
        doc.moveDown(0.5);

        // Material Rows
        doc.font('Helvetica').fontSize(9);

        materials.forEach((item) => {
          const y = doc.y;

          if (y > 500) {
            doc.addPage();
            doc.moveDown();
          }

          const totalItemValue = (item.quantity * item.unit_cost).toFixed(2);

          doc.text(item.name, 50, doc.y, { width: 150 });
          doc.text(item.quantity.toString(), 210, y, { width: 80 });
          doc.text(item.unit, 300, y, { width: 80 });
          doc.text(`
$$
{item.unit_cost}`, 390, y, { width: 80 });
          doc.text(`$${totalItemValue}`, 480, y, { width: 100 });
          doc.text(item.supplier || 'N/A', 590, y, { width: 150 });

          doc.moveDown();
          doc.moveTo(50, doc.y).lineTo(750, doc.y).stroke();
          doc.moveDown(0.5);
        });

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFService;