// ================================
// JSON FILE HELPER FUNCTIONS
// ================================
// These functions read and write to our data.json file

const fs = require('fs').promises;  // Use promises version for async/await
const path = require('path');

// Path to our data file
const DATA_FILE = path.join(__dirname, '../data/data.json');

/**
 * READ DATA FROM JSON FILE
 *
 * What it does:
 * 1. Opens data.json file
 * 2. Reads the contents
 * 3. Converts JSON string to JavaScript object
 * 4. Returns the data
 */
async function readData() {
  try {
    // Read file contents as string
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');

    // Convert JSON string to JavaScript object
    const data = JSON.parse(fileContent);

    return data;
  } catch (error) {
    // If file doesn't exist or is empty, return default structure
    if (error.code === 'ENOENT') {
      console.log('📁 Data file not found, creating new one...');
      const defaultData = { users: [] };
      await writeData(defaultData);
      return defaultData;
    }

    console.error('❌ Error reading data:', error.message);
    throw error;
  }
}

/**
 * WRITE DATA TO JSON FILE
 *
 * What it does:
 * 1. Takes JavaScript object
 * 2. Converts it to JSON string (pretty formatted)
 * 3. Writes to data.json file
 */
async function writeData(data) {
  try {
    // Convert object to pretty JSON string (2 spaces indent)
    const jsonString = JSON.stringify(data, null, 2);

    // Write to file
    await fs.writeFile(DATA_FILE, jsonString, 'utf-8');

    console.log('✅ Data saved successfully');
  } catch (error) {
    console.error('❌ Error writing data:', error.message);
    throw error;
  }
}

// Export functions so other files can use them
module.exports = {
  readData,
  writeData
};
