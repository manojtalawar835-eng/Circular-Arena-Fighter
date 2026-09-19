const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function createProjectZip() {
  const zip = new JSZip();
  const rootDir = process.cwd();

  const ignoreList = [
    'node_modules',
    '.git',
    'dist',
    'circular-arena-fighter-game.zip',
    'scripts'
  ];

  function addFolderToZip(folderPath, zipFolder) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      if (ignoreList.includes(item)) continue;
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(item);
        addFolderToZip(fullPath, subZip);
      } else {
        if (item.endsWith('.zip')) continue;
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(item, fileData);
      }
    }
  }

  console.log('Packaging project files into ZIP archive...');
  addFolderToZip(rootDir, zip);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Ensure public folder exists
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write to both root and public
  fs.writeFileSync(path.join(rootDir, 'circular-arena-fighter-game.zip'), content);
  fs.writeFileSync(path.join(publicDir, 'circular-arena-fighter-game.zip'), content);

  console.log(`ZIP created successfully! Size: ${(content.length / 1024).toFixed(1)} KB`);
}

createProjectZip().catch(err => {
  console.error('Error creating ZIP:', err);
  process.exit(1);
});
