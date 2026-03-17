/**
 * Genera favicon.ico a partir de tus PNG en public/ (sin transformar el diseño).
 * Si existen public/favicon-16x16.png y public/favicon-32x32.png, los usa.
 * Si no, hace fallback a app/icon.svg para no romper el build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

async function generateFavicon() {
  try {
    const pngToIco = (await import('png-to-ico')).default;
    const sharp = (await import('sharp')).default;

    const png32Path = path.join(publicDir, 'favicon-32x32.png');
    const png16Path = path.join(publicDir, 'favicon-16x16.png');

    let png16Buffer;
    let png32Buffer;

    if (fs.existsSync(png32Path) && fs.existsSync(png16Path)) {
      // Usar tus imágenes tal cual (solo empaquetar en .ico)
      png16Buffer = fs.readFileSync(png16Path);
      png32Buffer = fs.readFileSync(png32Path);
      console.log('✓ favicon.ico usando tus PNG de public/');
    } else {
      // Fallback: generar desde app/icon.svg si no hay PNG
      const svgPath = path.join(rootDir, 'app', 'icon.svg');
      if (!fs.existsSync(svgPath)) {
        console.warn('Favicon: no hay public/favicon-16x16.png, favicon-32x32.png ni app/icon.svg.');
        return;
      }
      const svgBuffer = fs.readFileSync(svgPath);
      png16Buffer = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
      png32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
      console.log('✓ favicon.ico generado desde app/icon.svg (fallback)');
    }

    const icoBuffer = await pngToIco([png16Buffer, png32Buffer]);
    const outputPath = path.join(rootDir, 'app', 'favicon.ico');
    fs.writeFileSync(outputPath, icoBuffer);
    console.log('✓ favicon.ico escrito en app/favicon.ico');
  } catch (err) {
    console.warn('Favicon: no se pudo generar.', err.message);
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log('  Instala: npm install sharp png-to-ico --save-dev');
    }
  }
}

generateFavicon();
