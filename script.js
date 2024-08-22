const fs = require('fs').promises;
const path = require('path');

async function processFiles() {
  try {
    // Read all files from the input directory
    const files = await fs.readdir('input');
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

    let allNames = [];

    // Process each JSON file
    for (const file of jsonFiles) {
      const inputPath = path.join('input', file);
      const data = await fs.readFile(inputPath, 'utf8');
      const inputData = JSON.parse(data);

      // Extract names from the current file
      let namesArray = inputData.results[0].hits.map(item => ({ name: item.name }));

      // Sort names alphabetically
      namesArray.sort((a, b) => a.name.localeCompare(b.name));

      // Add to the combined array
      allNames = allNames.concat(namesArray);

      // Write individual output file
      const outputFileName = `${path.parse(file).name}_output.json`;
      const outputPath = path.join('output', outputFileName);
      await fs.writeFile(outputPath, JSON.stringify(namesArray, null, 2));

      console.log(`Processed ${file} and saved output to ${outputFileName}`);
    }

    // Sort all names alphabetically
    allNames.sort((a, b) => a.name.localeCompare(b.name));

    // Write combined output file
    const fullOutputPath = path.join('output', 'full_output.json');
    await fs.writeFile(fullOutputPath, JSON.stringify(allNames, null, 2));

    console.log('Successfully processed all files and created full_output.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ensure output directory exists
fs.mkdir('output', { recursive: true })
  .then(() => processFiles())
  .catch(err => console.error('Error creating output directory:', err));