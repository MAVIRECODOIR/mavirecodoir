const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// R2 Configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://30a9ac5ae4015c2a629488fe19c5baa1.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: 'fc4g1UhiZuAgsYmwr9cB3uPEU6I4ZbPran-gcU5A',
    secretAccessKey: 'fc4g1UhiZuAgsYmwr9cB3uPEU6I4ZbPran-gcU5A',
  },
});

// Folder structure to create
const folders = [
  // Products
  'products/images/women/handbags/',
  'products/images/women/ready-to-wear/',
  'products/images/women/shoes/',
  'products/images/women/accessories/',
  'products/images/men/bags/',
  'products/images/men/ready-to-wear/',
  'products/images/men/shoes/',
  'products/images/men/accessories/',
  'products/images/unisex/jewellery/',
  'products/images/unisex/watches/',
  'products/thumbnails/',
  'products/swatches/leather/',
  'products/swatches/fabric/',
  'products/swatches/metal/',
  
  // Collections
  'collections/banners/',
  'collections/lookbooks/',
  'collections/campaigns/spring-2026/',
  'collections/campaigns/fall-2026/',
  'collections/campaigns/archival/',
  
  // Editorial
  'editorial/hero/',
  'editorial/stories/',
  'editorial/craftsmanship/',
  'editorial/sustainability/',
  
  // Brand
  'brand/logos/svg/',
  'brand/logos/png/',
  'brand/logos/favicon/',
  'brand/patterns/',
  'brand/textures/',
  
  // Models
  'models/women/',
  'models/men/',
  'models/campaigns/',
  
  // Store
  'store/boutiques/london/',
  'store/boutiques/accra/',
  'store/boutiques/tokyo/',
  'store/boutiques/new-york/',
  'store/interiors/',
  'store/events/',
  
  // User-generated
  'user-generated/reviews/',
  'user-generated/social/',
  'user-generated/community/',
  
  // Assets
  'assets/icons/',
  'assets/ui/',
  'assets/backgrounds/',
  
  // Temp
  'temp/uploads/',
  'temp/processing/',
];

async function createFolders() {
  console.log('Creating R2 folders...');
  
  for (const folder of folders) {
    try {
      const command = new PutObjectCommand({
        Bucket: 'mavire-assets',
        Key: folder + '.gitkeep', // Create a placeholder file
        Body: '', // Empty content
        ContentType: 'text/plain',
      });
      
      await r2Client.send(command);
      console.log(`✅ Created folder: ${folder}`);
    } catch (error) {
      console.error(`❌ Failed to create folder ${folder}:`, error.message);
    }
  }
  
  console.log('Folder creation complete!');
}

createFolders().catch(console.error);
