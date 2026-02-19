const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {

  // ════════════════════════════════════════════════════════════
  // Generate Single Daily Log Report (UPGRADED)
  // ════════════════════════════════════════════════════════════
  static async generateDailyLogReport(log, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // ── Input Validation ──────────────────────────────
        if (!log || typeof log !== 'object') {
          throw new Error('Log parameter must be a valid object');
        }

        const doc = new PDFDocument({
          margin: 50,
          size: 'LETTER',
          bufferPages: true,
          info: {
            Title: 'Daily Construction Log Report',
            Author: 'Construction Log System',
            Subject: `Daily Log #${log.log_id || 'N/A'}`,
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
          .text('Daily Construction Log Report', marginLeft, 30, {
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
        // LOG INFORMATION BOX
        // ══════════════════════════════════════════════════
        const infoBoxY = doc.y;
        doc
          .rect(marginLeft, infoBoxY, contentWidth, 160)
          .fillAndStroke(colors.lightGray, colors.mediumGray);

        doc
          .fillColor(colors.primary)
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Log Information', marginLeft + 15, infoBoxY + 12);

        drawLine(infoBoxY + 32, colors.mediumGray);

        const col1X = marginLeft + 15;
        const col2X = marginLeft + (contentWidth / 2) + 15;
        const fieldValueOffset = 110;
        let infoY = infoBoxY + 42;

        const logDetails = [
          { label: 'Log ID', value: `#${log.log_id || 'N/A'}`, col: 1 },
          { label: 'Project ID', value: log.project_id ? `#${log.project_id}` : 'N/A', col: 2 },
          { label: 'Date', value: log.date ? formatDate(log.date) : 'N/A', col: 1 },
          { label: 'Weather', value: log.weather || 'N/A', col: 2 },
          { label: 'Workers Count', value: log.workers_count || 'N/A', col: 1 },
          { label: 'GPS Location', value: log.gps_location || 'N/A', col: 2 }
        ];

        doc.fontSize(11).fillColor(colors.secondary);

        let row = 0;
        logDetails.forEach((item, index) => {
          const colX = item.col === 1 ? col1X : col2X;
          const currentY = infoBoxY + 42 + (Math.floor(index / 2) * 22);

          doc
            .font('Helvetica-Bold')
            .fillColor(colors.darkGray)
            .text(`${item.label}:`, colX, currentY, { continued: true })
            .font('Helvetica')
            .fillColor(colors.secondary)
            .text(` ${item.value}`);
        });

        doc.y = infoBoxY + 175;
        doc.moveDown(1);

        // ══════════════════════════════════════════════════
        // WORK PERFORMED SECTION
        // ══════════════════════════════════════════════════
        if (log.work_performed) {
          ensureSpace(120);

          const wpCardY = doc.y;

          // Left accent bar
          doc
            .rect(marginLeft, wpCardY, 4, 20)
            .fill(colors.accent);

          doc
            .fillColor(colors.primary)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Work Performed', marginLeft + 12, wpCardY + 3);

          doc.y = wpCardY + 28;

          doc
            .fontSize(11)
            .font('Helvetica')
            .fillColor(colors.secondary)
            .text(log.work_performed, marginLeft + 12, doc.y, {
              align: 'justify',
              width: contentWidth - 24
            });

          doc.moveDown(1);
          drawLine(doc.y, colors.mediumGray);
          doc.moveDown(1);
        }

        // ══════════════════════════════════════════════════
        // NOTES SECTION
        // ══════════════════════════════════════════════════
        if (log.notes) {
          ensureSpace(120);

          const notesCardY = doc.y;

          // Left accent bar
          doc
            .rect(marginLeft, notesCardY, 4, 20)
            .fill(colors.warning);

          doc
            .fillColor(colors.primary)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('Notes', marginLeft + 12, notesCardY + 3);

          doc.y = notesCardY + 28;

          doc
            .fontSize(11)
            .font('Helvetica')
            .fillColor(colors.secondary)
            .text(log.notes, marginLeft + 12, doc.y, {
              align: 'justify',
              width: contentWidth - 24
            });

          doc.moveDown(1);
          drawLine(doc.y, colors.mediumGray);
          doc.moveDown(1);
        }

        // ══════════════════════════════════════════════════
        // FOOTER — Page Numbers
        // ══════════════════════════════════════════════════
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);

          doc
            .strokeColor(colors.mediumGray)
            .lineWidth(0.5)
            .moveTo(marginLeft, doc.page.height - 60)
            .lineTo(pageWidth - marginRight, doc.page.height - 60)
            .stroke();

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

          doc
            .fontSize(8)
            .fillColor(colors.darkGray)
            .text(
              'Daily Construction Log Report — Construction Log System',
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

  // ════════════════════════════════════════════════════════════
  // Generate Multiple Daily Logs Report (UNTOUCHED)
  // ════════════════════════════════════════════════════════════

  static async generateMultipleDailyLogsReport(logs, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // ✅ FIX: Added bufferPages: true
        const doc = new PDFDocument({ margin: 50, bufferPages: true });
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

  // ════════════════════════════════════════════════════════════
  // Generate Equipment Report (UPGRADED)
  // ════════════════════════════════════════════════════════════
  
  static async generateEquipmentReport(equipment, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // ── Input Validation ──────────────────────────────
        if (!Array.isArray(equipment)) {
          throw new Error('Equipment parameter must be an array');
        }

        const doc = new PDFDocument({
          margin: 50,
          size: 'LETTER',
          bufferPages: true,
          info: {
            Title: 'Equipment Inventory Report',
            Author: 'Construction Log System',
            Subject: 'Equipment Records',
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

        // ── Helper: Status Badge Color ──────────────────
        const getStatusColor = (status) => {
          if (!status) return colors.darkGray;
          const s = status.toLowerCase().trim();
          if (['available', 'active', 'operational', 'in use'].includes(s)) return colors.success;
          if (['maintenance', 'repair', 'servicing'].includes(s)) return colors.warning;
          if (['broken', 'decommissioned', 'out of service', 'retired'].includes(s)) return colors.danger;
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
          .text('Equipment Inventory Report', marginLeft, 30, {
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
        // SUMMARY STATISTICS
        // ══════════════════════════════════════════════════
        const totalEquipment = equipment.length;
        const statusCounts = equipment.reduce((acc, item) => {
          const s = (item.status || 'Unknown').trim();
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {});
        const uniqueTypes = [...new Set(equipment.map(i => i.type).filter(Boolean))].length;

        const availableCount = equipment.filter(i =>
          ['available', 'active', 'operational', 'in use']
            .includes((i.status || '').toLowerCase().trim())
        ).length;
        const maintenanceCount = equipment.filter(i =>
          ['maintenance', 'repair', 'servicing']
            .includes((i.status || '').toLowerCase().trim())
        ).length;
        const outOfServiceCount = equipment.filter(i =>
          ['broken', 'decommissioned', 'out of service', 'retired']
            .includes((i.status || '').toLowerCase().trim())
        ).length;
        const otherCount = totalEquipment - availableCount - maintenanceCount - outOfServiceCount;
        const availabilityRate = totalEquipment > 0
          ? ((availableCount / totalEquipment) * 100).toFixed(1)
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
          .font('Helvetica-Bold').text('Total Equipment: ', col1X, statY, { continued: true })
          .font('Helvetica').text(`${totalEquipment}`);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Available/Active: ', col1X, statY, { continued: true })
          .fillColor(colors.success).font('Helvetica').text(`${availableCount}`)
          .fillColor(colors.secondary);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('In Maintenance: ', col1X, statY, { continued: true })
          .fillColor(colors.warning).font('Helvetica').text(`${maintenanceCount}`)
          .fillColor(colors.secondary);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Out of Service: ', col1X, statY, { continued: true })
          .fillColor(colors.danger).font('Helvetica').text(`${outOfServiceCount}`)
          .fillColor(colors.secondary);

        // Column 2
        statY = summaryBoxY + 42;
        doc
          .font('Helvetica-Bold').text('Availability Rate: ', col2X, statY, { continued: true })
          .font('Helvetica').text(`${availabilityRate}%`);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Equipment Types: ', col2X, statY, { continued: true })
          .font('Helvetica').text(`${uniqueTypes}`);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Other Status: ', col2X, statY, { continued: true })
          .font('Helvetica').text(`${otherCount}`);

        doc.y = summaryBoxY + 145;
        doc.moveDown(1);

        // ══════════════════════════════════════════════════
        // INDIVIDUAL EQUIPMENT RECORDS
        // ══════════════════════════════════════════════════
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .fillColor(colors.primary)
          .text('Equipment Records', { underline: true })
          .moveDown(1);

        equipment.forEach((item, index) => {
          ensureSpace(180);

          // ── Card Header ───────────────────────────────
          const cardY = doc.y;
          const statusColor = getStatusColor(item.status);

          // Left color accent bar
          doc
            .rect(marginLeft, cardY, 4, 20)
            .fill(statusColor);

          // Equipment title
          doc
            .fillColor(colors.primary)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(
              `${item.name || `Equipment #${index + 1}`}`,
              marginLeft + 12,
              cardY + 3
            );

          // Status badge (right-aligned)
          if (item.status) {
            const badgeText = item.status.toUpperCase();
            const badgeWidth = doc.widthOfString(badgeText) + 16;
            const badgeX = pageWidth - marginRight - badgeWidth;

            doc
              .roundedRect(badgeX, cardY, badgeWidth, 20, 3)
              .fill(statusColor);
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
          const fieldValueX = marginLeft + 150;

          const fields = [
            { label: 'Equipment ID', value: item.equipment_id ? `#${item.equipment_id}` : null },
            { label: 'Type', value: item.type },
            { label: 'Status', value: item.status },
            { label: 'Last Maintenance', value: item.last_maintenance ? formatDate(item.last_maintenance) : null },
            { label: 'Next Maintenance', value: item.next_maintenance ? formatDate(item.next_maintenance) : null },
            { label: 'Location', value: item.location },
            { label: 'Serial Number', value: item.serial_number },
            { label: 'Project ID', value: item.project_id ? `#${item.project_id}` : null }
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
          if (item.notes) {
            ensureSpace(80);
            doc
              .fontSize(10)
              .font('Helvetica-Bold')
              .fillColor(colors.darkGray)
              .text('Notes:', fieldLabelX, doc.y);
            doc
              .font('Helvetica')
              .fillColor(colors.secondary)
              .text(item.notes, fieldLabelX, doc.y, {
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

          doc
            .strokeColor(colors.mediumGray)
            .lineWidth(0.5)
            .moveTo(marginLeft, doc.page.height - 60)
            .lineTo(pageWidth - marginRight, doc.page.height - 60)
            .stroke();

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

          doc
            .fontSize(8)
            .fillColor(colors.darkGray)
            .text(
              'Equipment Inventory Report — Construction Log System',
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

  // ════════════════════════════════════════════════════════════
  // Generate Materials Report (UPGRADED)
  // ════════════════════════════════════════════════════════════
  static async generateMaterialsReport(materials, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // ── Input Validation ──────────────────────────────
        if (!Array.isArray(materials)) {
          throw new Error('Materials parameter must be an array');
        }

        const doc = new PDFDocument({
          margin: 50,
          size: 'LETTER',
          layout: 'landscape',
          bufferPages: true,
          info: {
            Title: 'Materials Inventory Report',
            Author: 'Construction Log System',
            Subject: 'Materials Records',
            CreationDate: new Date()
          }
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
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
          white: '#ffffff',
          tableHeader: '#283593',
          tableRowEven: '#f5f5f5',
          tableRowOdd: '#ffffff'
        };

        // ── Helper: Format Currency ─────────────────────
        const formatCurrency = (value) => {
          return `$${Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        };

        // ── Helper: Check if we need a new page ───────────
        const ensureSpace = (requiredSpace = 150) => {
          if (doc.y + requiredSpace > pageHeight - 80) {
            doc.addPage();
            return true;
          }
          return false;
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
          .text('Materials Inventory Report', marginLeft, 30, {
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
        // SUMMARY STATISTICS
        // ══════════════════════════════════════════════════
        const totalItems = materials.length;
        const totalValue = materials.reduce(
          (sum, item) => sum + ((item.quantity || 0) * (item.unit_cost || 0)),
          0
        );
        const totalQuantity = materials.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        const uniqueSuppliers = [...new Set(materials.map(i => i.supplier).filter(Boolean))].length;
        const uniqueUnits = [...new Set(materials.map(i => i.unit).filter(Boolean))].length;
        const avgUnitCost = totalItems > 0
          ? (materials.reduce((sum, item) => sum + (item.unit_cost || 0), 0) / totalItems)
          : 0;

        const highestValueItem = materials.reduce((max, item) => {
          const val = (item.quantity || 0) * (item.unit_cost || 0);
          const maxVal = (max.quantity || 0) * (max.unit_cost || 0);
          return val > maxVal ? item : max;
        }, materials[0] || {});

        // Summary Box
        const summaryBoxY = doc.y;
        doc
          .rect(marginLeft, summaryBoxY, contentWidth, 110)
          .fillAndStroke(colors.lightGray, colors.mediumGray);

        doc
          .fillColor(colors.primary)
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Summary Statistics', marginLeft + 15, summaryBoxY + 12);

        drawLine(summaryBoxY + 32, colors.mediumGray);

        const col1X = marginLeft + 15;
        const col2X = marginLeft + (contentWidth / 3) + 15;
        const col3X = marginLeft + (2 * contentWidth / 3) + 15;
        let statY = summaryBoxY + 42;

        doc.fontSize(11).font('Helvetica').fillColor(colors.secondary);

        // Column 1
        doc
          .font('Helvetica-Bold').text('Total Items: ', col1X, statY, { continued: true })
          .font('Helvetica').text(`${totalItems}`);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Total Quantity: ', col1X, statY, { continued: true })
          .font('Helvetica').text(`${totalQuantity.toLocaleString()}`);

        // Column 2
        statY = summaryBoxY + 42;
        doc
          .font('Helvetica-Bold').text('Total Value: ', col2X, statY, { continued: true })
          .fillColor(colors.success).font('Helvetica').text(`${formatCurrency(totalValue)}`)
          .fillColor(colors.secondary);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Avg Unit Cost: ', col2X, statY, { continued: true })
          .font('Helvetica').text(`${formatCurrency(avgUnitCost)}`);

        // Column 3
        statY = summaryBoxY + 42;
        doc
          .font('Helvetica-Bold').text('Suppliers: ', col3X, statY, { continued: true })
          .font('Helvetica').text(`${uniqueSuppliers}`);
        statY += 18;
        doc
          .font('Helvetica-Bold').text('Unit Types: ', col3X, statY, { continued: true })
          .font('Helvetica').text(`${uniqueUnits}`);

        doc.y = summaryBoxY + 125;
        doc.moveDown(1);

        // ══════════════════════════════════════════════════
        // MATERIALS TABLE
        // ══════════════════════════════════════════════════
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .fillColor(colors.primary)
          .text('Materials Detail', { underline: true })
          .moveDown(1);

        // Table column definitions
        const tableColumns = [
          { label: '#', x: marginLeft, width: 30 },
          { label: 'Name', x: marginLeft + 35, width: 170 },
          { label: 'Quantity', x: marginLeft + 210, width: 70 },
          { label: 'Unit', x: marginLeft + 285, width: 70 },
          { label: 'Unit Cost', x: marginLeft + 360, width: 85 },
          { label: 'Total Value', x: marginLeft + 450, width: 95 },
          { label: 'Supplier', x: marginLeft + 550, width: contentWidth - 550 }
        ];

        // ── Draw Table Header Function ──────────────────
        const drawTableHeader = () => {
          const headerY = doc.y;
          const headerHeight = 22;

          doc
            .rect(marginLeft, headerY, contentWidth, headerHeight)
            .fill(colors.tableHeader);

          doc
            .fillColor(colors.white)
            .fontSize(9)
            .font('Helvetica-Bold');

          tableColumns.forEach(col => {
            doc.text(col.label, col.x + 4, headerY + 6, { width: col.width - 8 });
          });

          doc.y = headerY + headerHeight + 2;
        };

        // Draw initial table header
        drawTableHeader();

        // ── Table Rows ──────────────────────────────────
        materials.forEach((item, index) => {
          if (ensureSpace(30)) {
            drawTableHeader();
          }

          const rowY = doc.y;
          const rowHeight = 20;
          const isEven = index % 2 === 0;

          // Row background
          doc
            .rect(marginLeft, rowY, contentWidth, rowHeight)
            .fill(isEven ? colors.tableRowEven : colors.tableRowOdd);

          const totalItemValue = ((item.quantity || 0) * (item.unit_cost || 0));

          doc
            .fillColor(colors.secondary)
            .fontSize(9)
            .font('Helvetica');

          doc.text(`${index + 1}`, tableColumns[0].x + 4, rowY + 5, { width: tableColumns[0].width - 8 });
          doc.text(item.name || 'N/A', tableColumns[1].x + 4, rowY + 5, { width: tableColumns[1].width - 8 });
          doc.text(`${item.quantity || 0}`, tableColumns[2].x + 4, rowY + 5, { width: tableColumns[2].width - 8 });
          doc.text(item.unit || 'N/A', tableColumns[3].x + 4, rowY + 5, { width: tableColumns[3].width - 8 });
          doc.text(formatCurrency(item.unit_cost || 0), tableColumns[4].x + 4, rowY + 5, { width: tableColumns[4].width - 8 });

          // Highlight high-value items
          if (totalItemValue > totalValue * 0.2) {
            doc.fillColor(colors.danger).font('Helvetica-Bold');
          } else {
            doc.fillColor(colors.success).font('Helvetica-Bold');
          }
          doc.text(formatCurrency(totalItemValue), tableColumns[5].x + 4, rowY + 5, { width: tableColumns[5].width - 8 });

          doc
            .fillColor(colors.secondary)
            .font('Helvetica');
          doc.text(item.supplier || 'N/A', tableColumns[6].x + 4, rowY + 5, { width: tableColumns[6].width - 8 });

          // Row border
          doc
            .strokeColor(colors.mediumGray)
            .lineWidth(0.5)
            .moveTo(marginLeft, rowY + rowHeight)
            .lineTo(pageWidth - marginRight, rowY + rowHeight)
            .stroke();

          doc.y = rowY + rowHeight;
        });

        // ── Table Total Row ─────────────────────────────
        doc.moveDown(0.3);
        const totalRowY = doc.y;
        const totalRowHeight = 24;

        doc
          .rect(marginLeft, totalRowY, contentWidth, totalRowHeight)
          .fill(colors.primary);

        doc
          .fillColor(colors.white)
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('TOTAL', tableColumns[0].x + 4, totalRowY + 6, { width: 200 })
          .text(`${totalQuantity.toLocaleString()}`, tableColumns[2].x + 4, totalRowY + 6, { width: tableColumns[2].width - 8 })
          .text(formatCurrency(totalValue), tableColumns[5].x + 4, totalRowY + 6, { width: tableColumns[5].width - 8 });

        doc.y = totalRowY + totalRowHeight;
        doc.moveDown(1);

        // ══════════════════════════════════════════════════
        // FOOTER — Page Numbers
        // ══════════════════════════════════════════════════
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);

          doc
            .strokeColor(colors.mediumGray)
            .lineWidth(0.5)
            .moveTo(marginLeft, pageHeight - 60)
            .lineTo(pageWidth - marginRight, pageHeight - 60)
            .stroke();

          doc
            .fontSize(9)
            .fillColor(colors.darkGray)
            .font('Helvetica')
            .text(
              `Page ${i + 1} of ${pageCount}`,
              marginLeft,
              pageHeight - 50,
              { align: 'center', width: contentWidth }
            );

          doc
            .fontSize(8)
            .fillColor(colors.darkGray)
            .text(
              'Materials Inventory Report — Construction Log System',
              marginLeft,
              pageHeight - 38,
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

  // ════════════════════════════════════════════════════════════
  // Generate Multiple Inspections Report (UNTOUCHED)
  // ════════════════════════════════════════════════════════════
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

        const insp_col1X = marginLeft + 15;
        const insp_col2X = marginLeft + (contentWidth / 2) + 15;
        let insp_statY = summaryBoxY + 42;

        doc.fontSize(11).font('Helvetica').fillColor(colors.secondary);

        // Column 1
        doc
          .font('Helvetica-Bold').text('Total Inspections: ', insp_col1X, insp_statY, { continued: true })
          .font('Helvetica').text(`${totalInspections}`);
        insp_statY += 18;
        doc
          .font('Helvetica-Bold').text('Passed: ', insp_col1X, insp_statY, { continued: true })
          .fillColor(colors.success).font('Helvetica').text(`${passCount}`)
          .fillColor(colors.secondary);
        insp_statY += 18;
        doc
          .font('Helvetica-Bold').text('Failed: ', insp_col1X, insp_statY, { continued: true })
          .fillColor(colors.danger).font('Helvetica').text(`${failCount}`)
          .fillColor(colors.secondary);
        insp_statY += 18;
        doc
          .font('Helvetica-Bold').text('Pending/Other: ', insp_col1X, insp_statY, { continued: true })
          .fillColor(colors.warning).font('Helvetica').text(`${pendingCount}`)
          .fillColor(colors.secondary);

        // Column 2
        insp_statY = summaryBoxY + 42;
        doc
          .font('Helvetica-Bold').text('Pass Rate: ', insp_col2X, insp_statY, { continued: true })
          .font('Helvetica').text(`${passRate}%`);
        insp_statY += 18;
        doc
          .font('Helvetica-Bold').text('Projects Covered: ', insp_col2X, insp_statY, { continued: true })
          .font('Helvetica').text(`${uniqueProjects}`);
        insp_statY += 18;
        doc
          .font('Helvetica-Bold').text('Inspectors: ', insp_col2X, insp_statY, { continued: true })
          .font('Helvetica').text(`${uniqueInspectors}`);
        insp_statY += 18;
        doc
          .font('Helvetica-Bold').text('Inspection Types: ', insp_col2X, insp_statY, { continued: true })
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