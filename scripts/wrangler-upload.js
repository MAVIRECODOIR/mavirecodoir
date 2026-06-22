const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function uploadToR2(filePath, key) {
  try {
    console.log(`Uploading ${filePath} to R2 as ${key}...`);
    
    // Use wrangler to upload the file
    const command = `npx wrangler r2 object put mavire-assets "${key}" --file="${filePath}"`;
    console.log(`Running: ${command}`);
    
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    
    console.log('Upload successful!');
    return `https://mavire-assets.30a9ac5ae4015c2a629488fe19c5baa1.r2.cloudflarestorage.com/${key}`;
    
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Export for use in API route
module.exports = { uploadToR2 };
