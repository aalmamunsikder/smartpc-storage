const https = require('https');
const fs = require('fs');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconDir = path.join(__dirname, 'electron', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// URL of a sample storage/cloud icon (from simpleicons.org)
const iconUrl = 'https://cdn-icons-png.flaticon.com/512/5229/5229335.png';
const filePath = path.join(iconDir, 'icon.png');

console.log(`Downloading icon from ${iconUrl} to ${filePath}...`);

https.get(iconUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download icon: ${response.statusCode} ${response.statusMessage}`);
    return;
  }

  const fileStream = fs.createWriteStream(filePath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Icon downloaded successfully');
  });
}).on('error', (err) => {
  console.error(`Error downloading icon: ${err.message}`);
}); 