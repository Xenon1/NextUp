# Release Pipeline Guide

This document explains how to use the automated release pipeline for NextUp.

## Overview

The release pipeline consists of three main workflows:

1. **test.yml** - Runs on every push and PR (tests, build, lint)
2. **release.yml** - Runs when you push a version tag (builds installers, creates release)
3. **Version Sync** - Automatically updates version across all files

## Quick Release Steps

### 1. Prepare Changes

```bash
# Make your code changes and commit them
git add .
git commit -m "Add new feature"
git push
```

### 2. Update Changelog

Edit `CHANGELOG.md` and move items from `[Unreleased]` to your version:

```markdown
## [0.2.0] - 2026-02-15

### Added
- New light mode theme
- Export to CSV feature

### Fixed
- Search performance bug
```

Commit the changelog:

```bash
git add CHANGELOG.md
git commit -m "Update changelog for v0.2.0"
git push
```

### 3. Create Release

```bash
# This will:
# - Update package.json version
# - Sync to Tauri & Cargo configs
# - Create git tag
# - Trigger GitHub Actions

npm run release:patch  # For bug fixes (0.1.0 → 0.1.1)
npm run release:minor  # For features (0.1.0 → 0.2.0)
npm run release:major  # For breaking changes (0.1.0 → 1.0.0)
```

### 4. Push to GitHub

```bash
# This triggers the release workflow automatically
git push && git push --tags
```

### 5. Watch the Magic ✨

GitHub Actions will automatically:
- Run all tests
- Build Windows MSI installer
- Build portable EXE
- Create GitHub Release
- Upload artifacts
- Generate download links

Check progress at: https://github.com/YOUR_USERNAME/NextUp/actions

## Version Format

Use **Semantic Versioning**: `MAJOR.MINOR.PATCH`

### When to bump each:

- **MAJOR** (1.0.0) - Breaking changes, major feature overhaul
- **MINOR** (0.2.0) - New features, backward compatible
- **PATCH** (0.1.1) - Bug fixes, no feature changes

### Examples:

```bash
# Bug fix release
npm run release:patch  # v0.1.0 → v0.1.1

# Feature release  
npm run release:minor  # v0.1.1 → v0.2.0

# Major version
npm run release:major  # v0.2.0 → v1.0.0
```

## What Gets Automated

### GitHub Actions Runs Tests

On **every push**:
- ✅ Run 76 unit tests
- ✅ TypeScript compilation
- ✅ ESLint checks
- ✅ Production build

### Release Workflow (on version tags)

When you push a tag like `v0.2.0`:
- 🔨 Builds Windows MSI installer
- 📦 Builds portable EXE
- 📝 Generates changelog from commits
- 🏷️ Creates GitHub Release
- 📥 Uploads download artifacts
- 📢 Publishes release notes

## Files Updated Automatically

When you run `npm run release:patch`:

1. **package.json** - Version number updated
2. **src-tauri/tauri.conf.json** - Product version synced
3. **src-tauri/Cargo.toml** - Rust version synced
4. **Git tag** - Created automatically (v0.1.1)

No manual edits needed!

## View Releases

- **GitHub Releases**: https://github.com/YOUR_USERNAME/NextUp/releases
- **Users can download**: MSI installer or portable EXE
- **Release notes** include changelog and installation instructions

## Rollback If Needed

If something goes wrong:

```bash
# Delete the tag locally
git tag -d v0.2.0

# Delete the tag on GitHub
git push origin --delete v0.2.0

# Fix the issue
# ... make fixes ...

# Try again with a new version
npm run release:minor
git push && git push --tags
```

## CI/CD Status Badge

Add to README (optional):

```markdown
[![Tests](https://github.com/YOUR_USERNAME/NextUp/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_USERNAME/NextUp/actions)
```

## Changelog Best Practices

### Good Changelog Entry

```markdown
## [0.2.0] - 2026-02-15

### Added
- Auto-transition for TV shows based on air dates (#42)
- Export watchlist to CSV format
- Dark mode theme option

### Changed
- Improved search performance for large lists
- Updated UI for better accessibility
- Bumped TMDB API to latest version

### Fixed
- Fixed crash when searching with special characters (#38)
- Fixed watchlist not persisting after app restart
- Fixed API key modal closing unexpectedly

### Security
- Updated dependencies to patch vulnerability
```

### What to Include

- ✅ Brief, user-friendly descriptions
- ✅ Reference issue numbers (#42, #38)
- ✅ Group by category (Added, Changed, Fixed, etc.)
- ✅ Use past tense ("Added feature", not "Add feature")

### What to Avoid

- ❌ Internal implementation details
- ❌ Commit hashes or git jargon
- ❌ Too much technical detail

## Manual Release (if needed)

If you prefer not to use automation:

```bash
# 1. Edit package.json version manually
# 2. Edit CHANGELOG.md with changes
# 3. Build locally
npm run tauri-build

# 4. Create tag and release on GitHub
git tag -a v0.2.0 -m "Release v0.2.0"
git push && git push origin v0.2.0

# 5. Go to GitHub and manually create release with built artifacts
```

## Troubleshooting

### Release workflow failed

1. Check [GitHub Actions](https://github.com/YOUR_USERNAME/NextUp/actions)
2. Click on the failed workflow
3. Review error logs
4. Common issues:
   - Tests failed (fix code)
   - Build failed (check Rust setup)
   - Tag already exists (delete and retry)

### Tests are failing in GitHub

1. Run locally: `npm run test -- --run`
2. Fix any issues
3. Commit and push
4. Release workflow will retry automatically

### Can't find built artifacts

In GitHub Release:
1. Look for "Assets" section (should show MSI and EXE)
2. If missing, check the "Artifacts" tab in workflow
3. Artifacts are kept for 90 days by default

## Next Steps

1. ✅ Read this guide
2. ✅ Make some code changes
3. ✅ Update CHANGELOG.md
4. ✅ Run `npm run release:patch`
5. ✅ Push with `git push && git push --tags`
6. ✅ Watch GitHub Actions build and release!

---

**Questions?** Check:
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Tauri Release Docs](https://tauri.app/about/security/#publishing-your-application)
