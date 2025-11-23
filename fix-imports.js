const fs = require('fs');
const path = require('path');


const directoryPath = path.join(__dirname, 'frontend', 'src', 'pages');

function replaceTsxExtensions(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceTsxExtensions(fullPath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/(['"\`])(\.\.\/[^'"\`]+?)\.tsx([\"'\`])/g, '$1$2$3');
      if(newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Fixed imports in ${fullPath}`);
      }
    }
  }
}

replaceTsxExtensions(directoryPath);
console.log('Completed fixing import paths.');
