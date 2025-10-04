# Pre-Commit Checklist - MAVIRE CODOIR

## ⚠️ BEFORE YOU COMMIT AND PUSH TO GITHUB

**READ THIS ENTIRE CHECKLIST BEFORE PROCEEDING**

---

## 🔒 Security Verification (CRITICAL)

### ✅ Files That Should NOT Be in Git

Run these commands to verify:

```powershell
# Check git status
git status

# Verify these files are NOT listed (should be excluded by .gitignore):
```

**MUST BE EXCLUDED**:
- [ ] ✅ `.env.local` - NOT in git status
- [ ] ✅ `.env.production` - NOT in git status
- [ ] ✅ `README-INTERNAL.md` - NOT in git status
- [ ] ✅ `node_modules/` - NOT in git status
- [ ] ✅ `.next/` - NOT in git status

**If any of these appear in `git status`, DO NOT COMMIT!**

### 🔍 Check for Credentials

```powershell
# Search for potential credentials in files to be committed
git diff --cached | Select-String -Pattern "password|secret|token|api_key"
```

- [ ] ✅ No actual credentials found in code
- [ ] ✅ Only placeholder values like `your_token_here`

---

## 📝 Required Updates Before Commit

### 1. Update LICENSE File

**File**: `LICENSE`  
**Lines to update**: 200-201, 247-250

```
Line 200-201: Add your jurisdiction
Line 247-250: Add your contact information
```

### 2. Update SECURITY.md File

**File**: `SECURITY.md`  
**Lines to update**: 217-220

```
Line 217-220: Add security contact email and phone
```

### 3. Verify .env.local Has Real Credentials

**DO NOT COMMIT THIS FILE**

But verify it exists locally with your actual Shopify credentials:
- [ ] ✅ `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is set
- [ ] ✅ `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` is set

---

## 🔧 Build & Test Verification

### Run These Commands

```powershell
# 1. Check for TypeScript errors
npm run build

# 2. Check for linting errors
npm run lint

# 3. Verify no vulnerabilities
npm audit

# 4. Check for outdated packages (optional)
npm outdated
```

**Results**:
- [ ] ✅ Build successful (no errors)
- [ ] ✅ Linting passed (no errors)
- [ ] ✅ Zero vulnerabilities
- [ ] ✅ All tests pass (when you add tests)

---

## 📋 Git Commit Preparation

### Stage Files Properly

```powershell
# Stage all files except sensitive ones (already excluded by .gitignore)
git add .

# Verify what's staged
git status
```

### Verify Staging

Check that these files ARE staged:
- [ ] ✅ `.gitignore`
- [ ] ✅ `LICENSE`
- [ ] ✅ `SECURITY.md`
- [ ] ✅ `README.md`
- [ ] ✅ `package.json`
- [ ] ✅ All documentation files
- [ ] ✅ All source code in `app/`, `components/`, `lib/`, etc.

Check that these files are NOT staged:
- [ ] ✅ `.env.local`
- [ ] ✅ `README-INTERNAL.md`
- [ ] ✅ `node_modules/`
- [ ] ✅ `.next/`

---

## 📝 Commit Message

Use a clear, semantic commit message:

```powershell
# Initial commit
git commit -m "feat: initial commit - headless Shopify store with Next.js 15

- Setup Next.js 15 with App Router and TypeScript
- Configure Tailwind CSS v4 with brand design system
- Integrate Shopify Storefront API client
- Add comprehensive documentation and security policies
- Implement proprietary license (all rights reserved)
- Configure environment variables and build tools
- Setup project structure for e-commerce functionality"
```

Or for subsequent commits, use semantic format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

---

## 🚀 Push to GitHub

### Before Pushing

- [ ] ✅ Verified commit looks correct with `git log --oneline -1`
- [ ] ✅ Double-checked no sensitive files are committed
- [ ] ✅ Build is successful
- [ ] ✅ Ready to make code public (within your private repository)

### Push Commands

```powershell
# Check current branch
git branch

# Push to GitHub (assuming 'main' branch)
git push origin main

# Or if it's your first push
git push -u origin main
```

---

## 📊 After Push Verification

### Verify on GitHub

1. **Go to GitHub repository**: https://github.com/[your-username]/mavirecodoir
2. **Check files**:
   - [ ] ✅ README.md is displayed
   - [ ] ✅ LICENSE is visible
   - [ ] ✅ .gitignore is present
   - [ ] ✅ No `.env.local` file visible
   - [ ] ✅ No `README-INTERNAL.md` visible
   - [ ] ✅ No credentials visible in code

3. **Check repository settings**:
   - [ ] ✅ Repository is **Private** (recommended)
   - [ ] ✅ Only authorized team members have access

---

## ⚠️ What to Do If You Accidentally Commit Secrets

**IMMEDIATE ACTIONS**:

1. **DO NOT just delete the file and commit again** - the secret is still in git history!

2. **Remove from history**:
   ```powershell
   # Remove sensitive file from all history
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch path/to/sensitive/file" --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

3. **Rotate compromised credentials**:
   - Generate new Shopify API tokens
   - Update `.env.local` with new credentials
   - Revoke old tokens in Shopify admin

4. **Review security**:
   - Check for any unauthorized access
   - Monitor for suspicious activity

---

## 📞 Need Help?

**Before committing**:
- Review this entire checklist
- Verify all items are checked
- When in doubt, ask for help

**Emergency**:
- If you accidentally commit secrets, follow the removal steps above immediately
- Contact your security team

---

## ✅ Final Checklist

Before pushing, confirm:

- [ ] ✅ All security checks passed
- [ ] ✅ No credentials in code
- [ ] ✅ Build successful
- [ ] ✅ LICENSE updated with your info
- [ ] ✅ SECURITY.md updated with contact info
- [ ] ✅ Good commit message written
- [ ] ✅ Only appropriate files staged
- [ ] ✅ README-INTERNAL.md excluded
- [ ] ✅ .env.local excluded
- [ ] ✅ Repository set to private (if applicable)

**Ready to push?**

```powershell
git push origin main
```

---

**Last Updated**: January 4, 2025  
**Your Current Location**: `C:\Users\disha\Documents\GitHub\mavirecodoir`  
**Ready to Push**: After completing this checklist ✅

---

## 🎉 After Successful Push

Once pushed successfully:

1. ✅ Verify on GitHub web interface
2. ✅ Clone to another location to test
3. ✅ Set up branch protection rules (if applicable)
4. ✅ Configure Vercel deployment (when ready)
5. ✅ Share repository access with team members (if any)

**Good luck with your MAVIRE CODOIR launch! 🚀**
