# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 

---

## [0.1.0] - 2026-01-10

### Added
- Initial release of NextUp
- Search and discover movies, TV shows, and anime via TMDB API
- 6-status watchlist system (Plan to Watch, Watching, Waiting for Next Ep, On Hold, Dropped, Completed)
- Dashboard with "Up Next" and "Airing Next" sections
- Real-time search with debounced results
- Secure API key management via Tauri backend config file
- First-run API key setup modal
- Complete local data storage (no cloud)
- Auto-transitions for TV shows based on air dates
- Beautiful dark mode UI
- Comprehensive test suite (76 tests)
- Windows desktop app with Tauri framework

### Tech Stack
- Tauri 2.9.5 for secure desktop application
- React 19.2.0 + TypeScript 5.9.3 for frontend
- Vite 7.3.1 for fast builds
- Vitest 4.0.16 with 76 unit tests
- The Movie Database (TMDB) API integration
- Local JSON file storage

---

## Versioning Guide

### MAJOR (Breaking Changes)
- Incompatible API changes
- Remove features
- Database format changes

### MINOR (New Features)
- Add new functionality
- New status types
- New search filters
- UI improvements

### PATCH (Bug Fixes)
- Fix bugs
- Minor improvements
- Documentation updates

---

## Release Process

### To Create a Release

1. **Update CHANGELOG.md** - Add changes under `[Unreleased]` section
2. **Commit changes** - `git commit -m "Prepare release v0.2.0"`
3. **Bump version** - `npm run release:minor` (or :patch/:major)
4. **Push to GitHub** - `git push && git push --tags`
5. **GitHub Actions** - Automatically:
   - Runs tests
   - Builds Windows installers
   - Creates GitHub Release with artifacts
   - Generates download links

### Version Bumping Examples

```bash
# Patch release (0.1.0 → 0.1.1)
npm run release:patch

# Minor release (0.1.0 → 0.2.0)
npm run release:minor

# Major release (0.1.0 → 1.0.0)
npm run release:major
```

This automatically:
- Updates version in package.json
- Syncs to Tauri config and Cargo.toml
- Creates git tag
- Triggers GitHub Actions release workflow

---

## Change Categories

When adding to CHANGELOG, use these categories:

### Added
- New features
- New integrations
- New API endpoints

### Changed
- Behavior changes
- UI improvements
- Performance improvements
- Dependency updates

### Fixed
- Bug fixes
- Security patches
- Type corrections

### Removed
- Deprecated features
- Removed dependencies
- Removed components

### Security
- Security vulnerabilities
- Safe practice updates

---

## Example Entry

```markdown
## [0.2.0] - 2026-02-15

### Added
- Light mode theme option
- Advanced filtering on watchlist
- Export watchlist to CSV

### Fixed
- Fixed API key modal not closing on mobile
- Fixed status transitions for anime
- Improved search performance for large libraries

### Changed
- Updated TMDB API to v3.13
- Improved dark mode colors for better contrast
```

---

## Archive

### [0.1.0] - Initial Release
- See full details above

---

For GitHub integration, tags should follow this pattern:
- `v0.1.0` (with "v" prefix)
- `v0.2.0-beta` (for pre-releases)
- `v1.0.0` (for stable releases)

See [GitHub Release Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) for more details.
