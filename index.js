const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const { recursiveZipCodeSearch } = require('./zip');
const port = 3000;
const filePath = path.join(__dirname, 'ar-zip-codes.txt');


function loadZipDataFile(filePath) {
    const zipData = {};
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    lines.forEach(line => {
        const row = line.split('\t');
        if (row.length >= 9) {
            const zipCode = row[1];
            const lat = parseFloat(row[9]);
            const lon = parseFloat(row[10]);
            zipData[zipCode] = { zip: row[1], lat, lon, loc: `${row[2]}, ${row[3]}`};
        }
    });
    return zipData;
}

// Function to load zip data
function loadZipData(filePath) {
    const zipCode = 1636;
    const zipData = loadZipDataFile(filePath);
    const zips = recursiveZipCodeSearch(zipCode, zipData);
    return zips.map(zip => zipData[zip])
}

const zipData = loadZipData(filePath);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get zip data
app.get('/api/zip-data', (req, res) => {
    res.json(zipData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});