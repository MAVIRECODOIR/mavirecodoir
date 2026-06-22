// Manual R2 folder creation using curl
// This bypasses Node.js SSL issues by using curl with proper authentication

const { execSync } = require('child_process');

// R2 Configuration
const ACCOUNT_ID = '30a9ac5ae4015c2a629488fe19c5baa1';
const ACCESS_KEY_ID = 'fc4g1UhiZuAgsYmwr9cB3uPEU6I4ZbPran-gcU5A';
const SECRET_ACCESS_KEY = 'fc4g1UhiZuAgsYmwr9cB3uPEU6I4ZbPran-gcU5A';
const BUCKET_NAME = 'mavire-assets';

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
  'collections/collections/archival',
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
  
  const curlCommand = `curl -X PUT -H "Authorization: Bearer ${ACCESS_KEY_ID}" -H "Content-Type: text/plain" -d "${placeholderContent}" "https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${folderPath}/.gitkeep"`;

  try {
    const result = execSync(curlCommand, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (result.includes('200') || result.includes('Created') || result.includes('Put')) {
      console.log(`✅ Created folder: ${folderPath}`);
      return true;
    } else {
      console.log(`❌ Failed to create folder: ${folderPath}`);
      console.error('Error:', result);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error creating folder ${folderPath}:`, error.message);
    return false;
  }
}

async function createAllFolders() {
  console.log('Creating all R2 folders manually...');
  
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
  }
}

// Run the folder creation
createAllFolders().catch(console.error);
