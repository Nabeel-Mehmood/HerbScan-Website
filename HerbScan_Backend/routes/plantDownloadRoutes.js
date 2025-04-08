const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Plant = require('../models/Plant');
const fs = require('fs');

// Helper for text sanitization
const sanitize = (value) => (value ? value.toString() : 'N/A');

// Styled Section Generator (matches overlay style)
function createSection(doc, title, startY, items) {
  let y = startY;

  // Section container box
  const boxHeight = 100 + items.length * 25;
  doc.rect(40, y - 10, 515, boxHeight)
     .fill('#f0fdf4')      // soft green background
     .stroke('#d1e7dd');   // subtle border

  // Section Title
  doc.font('Helvetica-Bold')
     .fillColor('#2E8B57')
     .fontSize(16)
     .text(title, 50, y);

  doc.moveTo(50, y + 20)
     .lineTo(545, y + 20)
     .lineWidth(1)
     .stroke('#2E8B57');

  y += 35;

  const columnGap = 30;
  const columnWidth = (doc.page.width - 100 - columnGap) / 2;

  let leftY = y;
  let rightY = y;

  items.filter(i => i.show).forEach((item, index) => {
    const label = `${item.label}: `;
    const value = sanitize(item.value);
    const isLeft = index % 2 === 0;

    const x = isLeft ? 50 : 50 + columnWidth + columnGap;
    const currentY = isLeft ? leftY : rightY;

    // Label
    doc.font('Helvetica-Bold')
       .fillColor('#14532d')
       .fontSize(12)
       .text(label, x, currentY, { continued: true });

    // Value
    doc.font('Helvetica')
       .fillColor('#374151')
       .fontSize(12)
       .text(value);

    if (isLeft) leftY += 25;
    else rightY += 25;
  });

  return Math.max(leftY, rightY) + 30;
}

// Route
router.post('/:plantId/download', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { filters } = req.body;
    const plant = await Plant.findById(plantId);

    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${plant.commonName}-details.pdf"`);

    doc.pipe(res);

    // Header Box
    doc.rect(40, 40, 515, 120)
       .fill('#f0fdf4')      // overlay-style background
       .stroke('#d1e7dd');   // soft border

    // Image handling
    if (plant.image && fs.existsSync(plant.image)) {
      try {
        doc.image(plant.image, 50, 50, { fit: [100, 100], align: 'left' });
      } catch {
        doc.rect(50, 50, 100, 100)
           .stroke('#2E8B57')
           .fill('#ffffff');
        doc.fontSize(10)
           .fill('#2E8B57')
           .text('Image Not Available', 55, 95, { width: 90, align: 'center' });
      }
    } else {
      doc.rect(50, 50, 100, 100)
         .stroke('#2E8B57')
         .fill('#ffffff');
      doc.fontSize(10)
         .fill('#2E8B57')
         .text('Image Not Available', 55, 95, { width: 90, align: 'center' });
    }

    // Plant Basic Info
    doc.font('Helvetica-Bold')
       .fillColor('#065f46')
       .fontSize(20)
       .text(plant.commonName, 170, 60);

    doc.font('Helvetica')
       .fillColor('#444')
       .fontSize(12)
       .text(`Family: ${sanitize(plant.familyName)}`, 170, 90)
       .text(`Botanical: ${sanitize(plant.botanicalName)}`, 170, 110)
       .text(`Regional: ${sanitize(plant.regionalName)}`, 170, 130);

    // Sections
    let yPosition = 180;
    const sections = [
      {
        condition: filters.family.length > 0,
        title: 'Classification',
        items: [
          { label: 'Family', value: plant.familyName, show: filters.family.includes('Family Name') },
          { label: 'Sub-Family', value: plant.subFamilyName, show: filters.family.includes('Sub-Family Name') },
          { label: 'Tribe', value: plant.tribeName, show: filters.family.includes('Tribe Name') }
        ]
      },
      {
        condition: filters.properties.length > 0,
        title: 'Properties',
        items: [
          { label: 'Medicinal', value: plant.medicinalProperties, show: filters.properties.includes('Medicinal Properties') },
          { label: 'Allergic', value: plant.allergicProperties, show: filters.properties.includes('Allergic Properties') }
        ]
      },
      {
        condition: filters.existence.length > 0,
        title: 'Existence',
        items: [
          { label: 'Agricultural', value: plant.agriculturalExistence, show: filters.existence.includes('Agricultural Existence') },
          { label: 'Seasonal', value: plant.seasonExistence, show: filters.existence.includes('Seasonal Existence') }
        ]
      },
      {
        condition: filters.name.length > 0,
        title: 'Name Details',
        items: [
          { label: 'Botanical', value: plant.botanicalName, show: filters.name.includes('Botanical Name') },
          { label: 'Common', value: plant.commonName, show: filters.name.includes('Common Name') },
          { label: 'Regional', value: plant.regionalName, show: filters.name.includes('Regional Name') }
        ]
      }
    ];

    for (const { condition, title, items } of sections) {
      if (condition) {
        yPosition = createSection(doc, title, yPosition, items);
      }
    }

    // Footer
    doc.fontSize(10)
       .fillColor('#666')
       .text(`Generated by HerbScan • ${new Date().toLocaleDateString()}`,
             40, doc.page.height - 40, { align: 'center', width: 515 });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
