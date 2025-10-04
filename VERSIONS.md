# Package Versions - MAVIRE CODOIR

**Last Updated**: January 4, 2025

All packages are running on their **latest stable versions** as of this date.

## Core Framework

| Package | Version | Description |
|---------|---------|-------------|
| Next.js | 15.5.4 | Latest Next.js with App Router and Turbopack |
| React | 19.2.0 | Latest React with improved performance |
| React DOM | 19.2.0 | Latest React DOM |
| TypeScript | ^5 | Latest TypeScript 5.x |

## Shopify & E-commerce

| Package | Version | Description |
|---------|---------|-------------|
| @shopify/hydrogen-react | 2025.7.0 | Latest Shopify Hydrogen React components |
| shopify-buy | 3.0.7 | Shopify JavaScript Buy SDK |
| graphql | 16.11.0 | GraphQL.js for type definitions |
| graphql-request | 7.2.0 | Lightweight GraphQL client |

## Styling

| Package | Version | Description |
|---------|---------|-------------|
| Tailwind CSS | ^4 | Latest Tailwind CSS v4 (PostCSS-based) |
| @tailwindcss/postcss | ^4 | Tailwind CSS PostCSS plugin |
| tailwind-merge | 3.3.1 | Utility for merging Tailwind classes |
| clsx | 2.1.1 | Utility for constructing className strings |

## State Management & Forms

| Package | Version | Description |
|---------|---------|-------------|
| zustand | 5.0.8 | Lightweight state management |
| react-hook-form | 7.64.0 | Performant forms with validation |
| @hookform/resolvers | 5.2.2 | Validation resolvers for react-hook-form |
| zod | 4.1.11 | TypeScript-first schema validation |

## UI Components & Icons

| Package | Version | Description |
|---------|---------|-------------|
| @headlessui/react | 2.2.9 | Unstyled, accessible UI components |
| @heroicons/react | 2.2.0 | Beautiful hand-crafted SVG icons |
| react-hot-toast | 2.6.0 | Lightweight notifications |

## Animations & Carousels

| Package | Version | Description |
|---------|---------|-------------|
| framer-motion | 12.23.22 | Production-ready motion library |
| swiper | 12.0.2 | Modern mobile touch slider |

## Utilities

| Package | Version | Description |
|---------|---------|-------------|
| currency.js | 2.0.4 | Currency formatting and calculations |

## Dev Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| @types/node | 24.6.2 | TypeScript definitions for Node.js |
| @types/react | 19.2.0 | TypeScript definitions for React |
| @types/react-dom | 19.2.0 | TypeScript definitions for React DOM |
| eslint | ^9 | Latest ESLint |
| eslint-config-next | 15.5.4 | Next.js ESLint configuration |
| @eslint/eslintrc | ^3 | ESLint configuration |

## Version Update History

### January 4, 2025
- ✅ Updated React from 19.1.0 → 19.2.0
- ✅ Updated React DOM from 19.1.0 → 19.2.0
- ✅ Updated @types/node from 20.19.19 → 24.6.2
- ✅ Updated @types/react to 19.2.0
- ✅ Updated @types/react-dom to 19.2.0
- ✅ Fixed Shopify client to use native fetch for better Next.js integration
- ✅ All packages are up to date
- ✅ Zero vulnerabilities
- ✅ Build successful

## Compatibility Notes

### React 19.2.0
- Improved Server Components performance
- Better error handling and debugging
- Enhanced streaming and suspense support

### Next.js 15.5.4 with Turbopack
- Faster development builds
- Improved Hot Module Replacement (HMR)
- Better caching and build performance
- Full App Router support

### Tailwind CSS v4
- New PostCSS-based architecture
- Improved performance
- Better developer experience with @theme inline
- CSS-first configuration

### TypeScript 5.x
- Improved type inference
- Better error messages
- Enhanced performance

## Keeping Up to Date

To check for outdated packages:
```bash
npm outdated
```

To update all packages (use with caution):
```bash
npm update --legacy-peer-deps
```

To update specific packages:
```bash
npm install package-name@latest --legacy-peer-deps
```

## Security

Current security status:
- ✅ **Zero vulnerabilities** detected
- ✅ All dependencies are maintained and actively developed
- ✅ Regular security audits recommended

Run security audit:
```bash
npm audit
```

Fix security issues:
```bash
npm audit fix
```

## Breaking Changes to Watch

### React 19
- Server Components are stable
- Use Client Components are required for client-side interactivity
- Automatic batching improvements

### Next.js 15
- App Router is now stable and recommended
- Turbopack is production-ready
- Metadata API for SEO

### Tailwind CSS v4
- New @theme syntax for configuration
- CSS variables-based theming
- PostCSS-only architecture

## Recommendations

1. **Don't update packages mid-development** unless there's a critical security issue
2. **Test thoroughly after updates** - run `npm run build` and `npm run dev`
3. **Read changelogs** before major version updates
4. **Use `--legacy-peer-deps`** flag when needed for peer dependency conflicts
5. **Keep Node.js updated** - Currently requires Node.js 18+

## Node.js Requirement

**Minimum Version**: Node.js 18.0.0
**Recommended**: Node.js 20.x or later
**Your Version**: Check with `node --version`

---

**Status**: ✅ All packages up to date | Zero vulnerabilities | Build successful

For package-specific documentation, refer to individual package websites or npm pages.
