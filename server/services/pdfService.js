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


// Generate Multiple Inspections Report
static async generateInspectionsReport(inspections, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // ── Input Validation ──────────────────────────────
      if (!Array.isArray(inspections)) {
        throw new Error('Inspections parameter must be an array');
      }

      const doc = new PDFDocument({
        margin: 50,
        size: 'LETTER',
        bufferPages: true,
        info: {
          Title: 'Inspections Report',
          Author: 'Construction Log System',
          Subject: 'Inspection Records',
          CreationDate: new Date()
        }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const marginLeft = 50;
      const marginRight = 50;
      const contentWidth = pageWidth - marginLeft - marginRight;

      // ── Color Palette ─────────────────────────────────
      const colors = {
        primary: '#1a237e',
        secondary: '#424242',
        accent: '#0d47a1',
        success: '#2e7d32',
        warning: '#f57f17',
        danger: '#c62828',
        lightGray: '#f5f5f5',
        mediumGray: '#e0e0e0',
        darkGray: '#616161',
        white: '#ffffff'
      };

      // ── Helper: Result Badge Color ────────────────────
      const getResultColor = (result) => {
        if (!result) return colors.darkGray;
        const r = result.toLowerCase().trim();
        if (['pass', 'passed', 'approved', 'compliant'].includes(r)) return colors.success;
        if (['fail', 'failed', 'rejected', 'non-compliant'].includes(r)) return colors.danger;
        if (['pending', 'in progress', 'conditional'].includes(r)) return colors.warning;
        return colors.darkGray;
      };

      // ── Helper: Format Date Consistently ──────────────
      const formatDate = (dateValue) => {
        try {
          const date = new Date(dateValue);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch {
          return 'N/A';
        }
      };

      // ── Helper: Check if we need a new page ───────────
      const ensureSpace = (requiredSpace = 150) => {
        if (doc.y + requiredSpace > doc.page.height - 80) {
          doc.addPage();
        }
      };

      // ── Helper: Draw horizontal line ──────────────────
      const drawLine = (y = null, color = colors.mediumGray) => {
        const lineY = y || doc.y;
        doc
          .strokeColor(color)
          .lineWidth(1)
          .moveTo(marginLeft, lineY)
          .lineTo(pageWidth - marginRight, lineY)
          .stroke();
      };

      // ══════════════════════════════════════════════════
      // HEADER SECTION
      // ══════════════════════════════════════════════════
      doc
        .rect(0, 0, pageWidth, 120)
        .fill(colors.primary);

      doc
        .fillColor(colors.white)
        .fontSize(26)
        .font('Helvetica-Bold')
        .text('Inspections', marginLeft, 30, {
          align: 'center',
          width: contentWidth
        });

      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#bbdefb')
        .text('Construction Log System', marginLeft, 65, {
          align: 'center',
          width: contentWidth
        });

      doc
        .fontSize(10)
        .text(`Generated: ${new Date().toLocaleString('en-US')}`, marginLeft, 85, {
          align: 'center',
          width: contentWidth
        });

      doc.y = 140;
      doc.fillColor(colors.secondary);

      // ══════════════════════════════════════════════════
      // FILTER INFO
      // ══════════════════════════════════════════════════
      if (options.startDate && options.endDate) {
        doc
          .fontSize(11)
          .font('Helvetica-Oblique')
          .fillColor(colors.accent)
          .text(
            `Period: ${formatDate(options.startDate)} to ${formatDate(options.endDate)}`,
            { align: 'center' }
          )
          .moveDown(1.5);
      }

      // ══════════════════════════════════════════════════
      // SUMMARY STATISTICS
      // ══════════════════════════════════════════════════
      const totalInspections = inspections.length;
      const passCount = inspections.filter(i =>
        ['pass', 'passed', 'approved', 'compliant']
          .includes((i.result || '').toLowerCase().trim())
      ).length;
      const failCount = inspections.filter(i =>
        ['fail', 'failed', 'rejected', 'non-compliant']
          .includes((i.result || '').toLowerCase().trim())
      ).length;
      const pendingCount = totalInspections - passCount - failCount;

      const uniqueProjects = [...new Set(inspections.map(i => i.project_id).filter(Boolean))].length;
      const uniqueInspectors = [...new Set(inspections.map(i => i.inspector).filter(Boolean))].length;
      const uniqueTypes = [...new Set(inspections.map(i => i.type).filter(Boolean))].length;
      const passRate = totalInspections > 0
        ? ((passCount / totalInspections) * 100).toFixed(1)
        : 0;

      // Summary Box
      const summaryBoxY = doc.y;
      doc
        .rect(marginLeft, summaryBoxY, contentWidth, 130)
        .fillAndStroke(colors.lightGray, colors.mediumGray);

      doc
        .fillColor(colors.primary)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Summary Statistics', marginLeft + 15, summaryBoxY + 12);

      drawLine(summaryBoxY + 32, colors.mediumGray);

      const col1X = marginLeft + 15;
      const col2X = marginLeft + (contentWidth / 2) + 15;
      let statY = summaryBoxY + 42;

      doc.fontSize(11).font('Helvetica').fillColor(colors.secondary);

      // Column 1
      doc
        .font('Helvetica-Bold').text('Total Inspections: ', col1X, statY, { continued: true })
        .font('Helvetica').text(`${totalInspections}`);
      statY += 18;
      doc
        .font('Helvetica-Bold').text('Passed: ', col1X, statY, { continued: true })
        .fillColor(colors.success).font('Helvetica').text(`${passCount}`)
        .fillColor(colors.secondary);
      statY += 18;
      doc
        .font('Helvetica-Bold').text('Failed: ', col1X, statY, { continued: true })
        .fillColor(colors.danger).font('Helvetica').text(`${failCount}`)
        .fillColor(colors.secondary);
      statY += 18;
      doc
        .font('Helvetica-Bold').text('Pending/Other: ', col1X, statY, { continued: true })
        .fillColor(colors.warning).font('Helvetica').text(`${pendingCount}`)
        .fillColor(colors.secondary);

      // Column 2
      statY = summaryBoxY + 42;
      doc
        .font('Helvetica-Bold').text('Pass Rate: ', col2X, statY, { continued: true })
        .font('Helvetica').text(`${passRate}%`);
      statY += 18;
      doc
        .font('Helvetica-Bold').text('Projects Covered: ', col2X, statY, { continued: true })
        .font('Helvetica').text(`${uniqueProjects}`);
      statY += 18;
      doc
        .font('Helvetica-Bold').text('Inspectors: ', col2X, statY, { continued: true })
        .font('Helvetica').text(`${uniqueInspectors}`);
      statY += 18;
      doc
        .font('Helvetica-Bold').text('Inspection Types: ', col2X, statY, { continued: true })
        .font('Helvetica').text(`${uniqueTypes}`);

      doc.y = summaryBoxY + 145;
      doc.moveDown(1);

      // ══════════════════════════════════════════════════
      // INDIVIDUAL INSPECTION RECORDS
      // ══════════════════════════════════════════════════
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(colors.primary)
        .text('Inspection Records', { underline: true })
        .moveDown(1);

      inspections.forEach((inspection, index) => {
        // Smart page break — check if enough space exists
        ensureSpace(200);

        // ── Card Header ───────────────────────────────
        const cardY = doc.y;
        const resultColor = getResultColor(inspection.result);

        // Left color accent bar
        doc
          .rect(marginLeft, cardY, 4, 20)
          .fill(resultColor);

        // Inspection title
        doc
          .fillColor(colors.primary)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(
            `Inspection #${index + 1}`,
            marginLeft + 12,
            cardY + 3
          );

        // Result badge (right-aligned)
        if (inspection.result) {
          const badgeText = inspection.result.toUpperCase();
          const badgeWidth = doc.widthOfString(badgeText) + 16;
          const badgeX = pageWidth - marginRight - badgeWidth;

          doc
            .roundedRect(badgeX, cardY, badgeWidth, 20, 3)
            .fill(resultColor);
          doc
            .fillColor(colors.white)
            .fontSize(9)
            .font('Helvetica-Bold')
            .text(badgeText, badgeX + 8, cardY + 5);
        }

        doc.y = cardY + 28;
        doc.fillColor(colors.secondary);

        // ── Card Body (Field Rows) ────────────────────
        const fieldLabelX = marginLeft + 12;
        const fieldValueX = marginLeft + 130;

        const fields = [
          { label: 'Project ID', value: inspection.project_id ? `#${inspection.project_id}` : null },
          { label: 'Date', value: inspection.date ? formatDate(inspection.date) : null },
          { label: 'Type', value: inspection.type },
          { label: 'Inspector', value: inspection.inspector },
          { label: 'ISO Reference', value: inspection.iso_reference }
        ];

        fields.forEach(field => {
          if (field.value) {
            doc
              .fontSize(10)
              .font('Helvetica-Bold')
              .fillColor(colors.darkGray)
              .text(`${field.label}:`, fieldLabelX, doc.y)
              .moveUp()
              .font('Helvetica')
              .fillColor(colors.secondary)
              .text(field.value, fieldValueX, doc.y);
            doc.moveDown(0.2);
          }
        });

        doc.moveDown(0.3);

        // Notes Section
        if (inspection.notes) {
          ensureSpace(80);
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(colors.darkGray)
            .text('Notes:', fieldLabelX, doc.y);
          doc
            .font('Helvetica')
            .fillColor(colors.secondary)
            .text(inspection.notes, fieldLabelX, doc.y, {
              align: 'justify',
              width: contentWidth - 24
            });
          doc.moveDown(0.3);
        }

        // Separator line
        doc.moveDown(0.5);
        drawLine(doc.y, colors.mediumGray);
        doc.moveDown(1);
      });

      // ══════════════════════════════════════════════════
      // FOOTER — Page Numbers
      // ══════════════════════════════════════════════════
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);

        // Footer line
        doc
          .strokeColor(colors.mediumGray)
          .lineWidth(0.5)
          .moveTo(marginLeft, doc.page.height - 60)
          .lineTo(pageWidth - marginRight, doc.page.height - 60)
          .stroke();

        // Page number
        doc
          .fontSize(9)
          .fillColor(colors.darkGray)
          .font('Helvetica')
          .text(
            `Page ${i + 1} of ${pageCount}`,
            marginLeft,
            doc.page.height - 50,
            { align: 'center', width: contentWidth }
          );

        // Footer branding
        doc
          .fontSize(8)
          .fillColor(colors.darkGray)
          .text(
            'Inspections Report — Construction Log System',
            marginLeft,
            doc.page.height - 38,
            { align: 'center', width: contentWidth }
          );
      }

      // ══════════════════════════════════════════════════
      // FINALIZE
      // ══════════════════════════════════════════════════
      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));

    } catch (error) {
      reject(error);
    }
  });
}


}

module.exports = PDFService;