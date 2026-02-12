const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { filename, path: filepath } = req.file;
    const outputDir = 'uploads/photos/processed';
    
    // Create processed directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create thumbnail directory
    const thumbnailDir = 'uploads/photos/thumbnails';
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Process main image (resize if too large, compress)
    const processedFilename = `processed-${filename}`;
    const processedPath = path.join(outputDir, processedFilename);
    
    await sharp(filepath)
      .resize(1920, 1080, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(processedPath);

    // Create thumbnail
    const thumbnailFilename = `thumb-${filename}`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
    
    await sharp(filepath)
      .resize(300, 200, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    // Update req.file with processed image info
    req.file.processedPath = processedPath;
    req.file.processedFilename = processedFilename;
    req.file.thumbnailPath = thumbnailPath;
    req.file.thumbnailFilename = thumbnailFilename;

    // Optional: Delete original large file
    // fs.unlinkSync(filepath);

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(error);
  }
};

module.exports = processImage;