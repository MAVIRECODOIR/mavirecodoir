// Create R2 folders using Wrangler CLI
// This bypasses SSL issues by using Cloudflare's own tools

const { execSync } = require('child_process');

// Folders to create
const folders = [
  'products/images/women/handbags',
  'products/images/women/ready-to-wear',
  'products/images/women/shoes',
  'products/images/women/accessories',
  'products/images/men/bags',
  'products/images/men/ready-to-wear',
  'products/images/men/shoes',
  'products/images/men/accessories',
  'products/images/unisex/jewellery',
  'products/images/unisex/watches',
  'products/thumbnails',
  'products/swatches/leather',
  'products/swatches/fabric',
  'products/swatches/metal',
  'collections/banners',
  'collections/lookbooks',
  'collections/campaigns/spring-2026',
  'collections/campaigns/fall-2026',
  'collections/campaigns/archival',
  'editorial/hero',
  'editorial/stories',
  'editorial/craftsmanship',
  'editorial/sustainability',
  'brand/logos/svg',
  'brand/logos/png',
  'brand/logos/favicon',
  'brand/patterns',
  'brand/textures',
  'models/women',
  'models/men',
  'models/campaigns',
  'store/boutiques/london',
  'store/boutiques/accra',
  'store/boutiques/tokyo',
  'store/boutiques/new-york',
  'store/interiors',
  'store/events',
  'user-generated/reviews',
  'user-generated/social',
  'user-generated/community',
  'assets/icons',
  'assets/ui',
  'assets/backgrounds',
  'temp/uploads',
  'temp/processing'
];

async function createFolder(folderPath) {
  console.log(`Creating folder: ${folderPath}`);
  
  // Create a placeholder file to establish the folder structure
  const placeholderContent = `Folder created: ${folderPath}`;
  
  // Use wrangler r2 object put with proper syntax
  const wranglerCommand = `npx wrangler r2 object put mavire-assets "${folderPath}/.gitkeep"`;
  
  try {
    // Create a temporary file
    const tempFile = `temp-${folderPath.replace(/\//g, '-')}.txt`;
    require('fs').writeFileSync(tempFile, placeholderContent);
    
    const result = execSync(`${wranglerCommand} --file="${tempFile}"`, { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: 'workers'
    });
    
    // Clean up temp file
    try {
      require('fs').unlinkSync(tempFile);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    console.log(`✅ Created folder: ${folderPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating folder ${folderPath}:`, error.message);
    return false;
  }
}

async function createAllFolders() {
  console.log('Creating all R2 folders using Wrangler CLI...');
  console.log('🔧 This uses Cloudflare\'s own tools to bypass SSL issues\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const folder of folders) {
    const success = await createFolder(folder);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Successfully created: ${successCount} folders`);
  console.log(`❌ Failed: ${failCount} folders`);
  
  if (successCount > 0) {
    console.log('\n🎉 Your R2 bucket now has the folder structure!');
    console.log('📁 You can now upload files directly to these folders.');
    console.log('🔗 Access your files at: https://dash.cloudflare.com/30a9ac5ae4015c2a629488fe19c5baa1/r2/overview');
    console.log('\n📋 Manual Upload Instructions:');
    console.log('1. Go to the R2 bucket in Cloudflare Dashboard');
    console.log('2. Navigate to any of the created folders');
    console.log('3. Click "Upload files"');
    console.log('4. Upload your SVG files directly');
  }
}

// Run the folder creation
createAllFolders().catch(console.error);
