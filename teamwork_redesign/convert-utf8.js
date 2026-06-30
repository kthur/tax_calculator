const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tax-calculator.js');
const buffer = fs.readFileSync(filePath);

if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  console.log('Detected UTF-16 LE BOM. Converting to UTF-8...');
  const text = buffer.toString('utf16le');
  const cleanText = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  fs.writeFileSync(filePath, cleanText, 'utf8');
  console.log('Conversion complete!');
} else {
  console.log('Not UTF-16 LE BOM. First bytes:', buffer.slice(0, 4));
}
