const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

// Path to the existing SVG icon
const iconsDir = path.join(__dirname, 'src', 'assets', 'images', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

if (!fs.existsSync(svgPath)) {
  console.error('icon.svg not found in src/assets/images/icons/. Please add your SVG icon first.');
  process.exit(1);
}

// Read the SVG file
const svgIcon = fs.readFileSync(svgPath);

async function generateIcons() {
  try {
    // Generate PNG files of different sizes
    const sizes = [16, 32, 48, 64, 128, 192, 256, 512];
    const pngFiles = [];

    for (const size of sizes) {
      const pngPath = path.join(iconsDir, `favicon-${size}x${size}.png`);
      await sharp(svgIcon).resize(size, size).png().toFile(pngPath);
      pngFiles.push(pngPath);
    }

    // Generate ICO file from 16x16 and 32x32 PNGs
    const icoBuffer = await pngToIco(pngFiles.slice(0, 2));
    fs.writeFileSync(path.join(iconsDir, 'favicon.ico'), icoBuffer);

    // Generate Apple Touch Icon (180x180)
    await sharp(svgIcon).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));

    console.log('Icon files generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
