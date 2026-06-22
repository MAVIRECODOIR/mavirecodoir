export interface FolderPaths {
  products: {
    images: {
      women: {
        handbags: string;
        readyToWear: string;
        shoes: string;
        accessories: string;
      };
      men: {
        bags: string;
        readyToWear: string;
        shoes: string;
        accessories: string;
      };
      unisex: {
        jewellery: string;
        watches: string;
      };
    };
    thumbnails: string;
    swatches: {
      leather: string;
      fabric: string;
      metal: string;
    };
  };
  collections: {
    banners: string;
    lookbooks: string;
    campaigns: {
      spring2026: string;
      fall2026: string;
      archival: string;
    };
  };
  editorial: {
    hero: string;
    stories: string;
    craftsmanship: string;
    sustainability: string;
  };
  brand: {
    logos: {
      svg: string;
      png: string;
      favicon: string;
    };
    patterns: string;
    textures: string;
  };
  models: {
    women: string;
    men: string;
    campaigns: string;
  };
  store: {
    boutiques: {
      london: string;
      accra: string;
      tokyo: string;
      newYork: string;
    };
    interiors: string;
    events: string;
  };
  userGenerated: {
    reviews: string;
    social: string;
    community: string;
  };
  assets: {
    icons: string;
    ui: string;
    backgrounds: string;
  };
  temp: {
    uploads: string;
    processing: string;
  };
}

export const folderPaths: FolderPaths = {
  products: {
    images: {
      women: {
        handbags: 'products/images/women/handbags',
        readyToWear: 'products/images/women/ready-to-wear',
        shoes: 'products/images/women/shoes',
        accessories: 'products/images/women/accessories',
      },
      men: {
        bags: 'products/images/men/bags',
        readyToWear: 'products/images/men/ready-to-wear',
        shoes: 'products/images/men/shoes',
        accessories: 'products/images/men/accessories',
      },
      unisex: {
        jewellery: 'products/images/unisex/jewellery',
        watches: 'products/images/unisex/watches',
      },
    },
    thumbnails: 'products/thumbnails',
    swatches: {
      leather: 'products/swatches/leather',
      fabric: 'products/swatches/fabric',
      metal: 'products/swatches/metal',
    },
  },
  collections: {
    banners: 'collections/banners',
    lookbooks: 'collections/lookbooks',
    campaigns: {
      spring2026: 'collections/campaigns/spring-2026',
      fall2026: 'collections/campaigns/fall-2026',
      archival: 'collections/campaigns/archival',
    },
  },
  editorial: {
    hero: 'editorial/hero',
    stories: 'editorial/stories',
    craftsmanship: 'editorial/craftsmanship',
    sustainability: 'editorial/sustainability',
  },
  brand: {
    logos: {
      svg: 'brand/logos/svg',
      png: 'brand/logos/png',
      favicon: 'brand/logos/favicon',
    },
    patterns: 'brand/patterns',
    textures: 'brand/textures',
  },
  models: {
    women: 'models/women',
    men: 'models/men',
    campaigns: 'models/campaigns',
  },
  store: {
    boutiques: {
      london: 'store/boutiques/london',
      accra: 'store/boutiques/accra',
      tokyo: 'store/boutiques/tokyo',
      newYork: 'store/boutiques/new-york',
    },
    interiors: 'store/interiors',
    events: 'store/events',
  },
  userGenerated: {
    reviews: 'user-generated/reviews',
    social: 'user-generated/social',
    community: 'user-generated/community',
  },
  assets: {
    icons: 'assets/icons',
    ui: 'assets/ui',
    backgrounds: 'assets/backgrounds',
  },
  temp: {
    uploads: 'temp/uploads',
    processing: 'temp/processing',
  },
};

// Helper function to get folder path for different asset types
export function getFolderPath(type: keyof FolderPaths, subPath?: string): string {
  const folder = folderPaths[type];
  
  if (!subPath) {
    return typeof folder === 'string' ? folder : '';
  }
  
  // Navigate nested objects
  const pathParts = subPath.split('.');
  let current: any = folder;
  
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return '';
    }
  }
  
  return typeof current === 'string' ? current : '';
}

// Common folder combinations for easy access
export const commonFolders = {
  productImage: (category: string, gender: string, type: string) => 
    `products/images/${gender}/${category}`,
  
  collectionBanner: () => folderPaths.collections.banners,
  
  heroImage: () => folderPaths.editorial.hero,
  
  brandLogo: (format: 'svg' | 'png' | 'favicon') => 
    folderPaths.brand.logos[format],
  
  modelShot: (gender: 'women' | 'men' | 'campaigns') => 
    folderPaths.models[gender],
  
  boutiqueImage: (location: 'london' | 'accra' | 'tokyo' | 'newYork') => 
    folderPaths.store.boutiques[location],
  
  userReview: () => folderPaths.userGenerated.reviews,
  
  tempUpload: () => folderPaths.temp.uploads,
};
