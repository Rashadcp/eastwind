const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const HERO_DIR = path.join(__dirname, 'public', 'hero-frames');
const PUBLIC_DIR = path.join(__dirname, 'public');

async function processDirectory(directory, maxWidth) {
  try {
    const files = await readdir(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStat = await stat(filePath);
      
      // Skip directories (only process immediate files)
      if (fileStat.isDirectory()) continue;
      
      if (file.toLowerCase().endsWith('.png')) {
        const webpPath = filePath.replace(/\.png$/i, '.webp');
        
        console.log(`Optimizing: ${filePath}`);
        
        const image = sharp(filePath);
        const metadata = await image.metadata();
        
        // Resize if it exceeds maxWidth
        if (maxWidth && metadata.width > maxWidth) {
          image.resize({ width: maxWidth });
        }
        
        // Convert to webp with 75% quality
        await image.webp({ quality: 75 }).toFile(webpPath);
        
        // Delete original PNG to save space
        await unlink(filePath);
        console.log(`-> Saved ${webpPath} and deleted original.`);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}:`, err);
  }
}

async function main() {
  console.log("Starting image optimization...");
  
  // Process hero frames (resize to 1920 width max)
  if (fs.existsSync(HERO_DIR)) {
    console.log("Processing Hero Frames...");
    await processDirectory(HERO_DIR, 1920);
  } else {
    console.log("Hero frames directory not found.");
  }
  
  // Process general public images (no resize, just format conversion)
  if (fs.existsSync(PUBLIC_DIR)) {
    console.log("Processing public root images...");
    await processDirectory(PUBLIC_DIR, null);
  }
  
  console.log("Image optimization complete!");
}

main();
