const fs = require('fs');
const path = require('path');

const skinsDirectory = 'src/assets/images/skins'; // adjust the path as needed
const outputJsonFile = 'src/assets/images/skins/skins.json'; // adjust the path as needed

function getFilesRecursively(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  return files.reduce((fileList, file) => {
    const fullPath = path.join(directory, file.name);

    if (file.isDirectory()) {
      return [...fileList, ...getFilesRecursively(fullPath)];
    }

    return [...fileList, fullPath];
  }, []);
}

function generateSkinsJson() {
  const skins = getFilesRecursively(skinsDirectory).map((filePath) => {
    const relativePath = path.relative(skinsDirectory, filePath);
    return { fileName: path.basename(filePath), relativePath: relativePath };
  });

  const jsonContent = JSON.stringify(skins, null, 2);

  fs.writeFileSync(outputJsonFile, jsonContent);

  console.log('skins.json generated successfully!');
}

generateSkinsJson();
