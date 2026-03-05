/**
 * Genera favicon.ico desde app/icon.svg
 * Ejecutar: node scripts/generate-favicon.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function generateFavicon() {
  try {
    const sharp = (await import('sharp')).default;
    const pngToIco = (await import('png-to-ico')).default;

    const svgPath = path.join(rootDir, 'app', 'icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);

    // Generar PNG 32x32
    const pngBuffer = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();

    // Convertir a ICO (incluye 16x16 y 32x32 para mejor compatibilidad)
    const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
    const icoBuffer = await pngToIco([png16, pngBuffer]);

    const outputPath = path.join(rootDir, 'app', 'favicon.ico');
    fs.writeFileSync(outputPath, icoBuffer);
    console.log('✓ favicon.ico generado en app/favicon.ico');
  } catch (err) {
    console.warn('Favicon: no se pudo generar (usa app/icon.svg).', err.message);
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log('  Instala: npm install sharp png-to-ico --save-dev');
    }
  }
}

generateFavicon();
