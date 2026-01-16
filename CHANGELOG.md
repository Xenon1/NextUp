# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.1] - 2026-01-17

### Added
- Added remove from watchlist confirmation to the up next page

### Changed
- Media info by click on poster in Up Next now renders it in the center of the window

### Fixed
- searching for show or anime and adding to watchlist now lets you select your current season and episode
- removing something from your watchlist no longer requires a app restart to see the change
- Remove from watchlist button now renders in main watchlists

### Removed
- 

---

## [0.3.0] - 2026-01-16

### Added
- Overhauled UI

### Changed
- 

### Fixed
- 

### Removed
- 

---

## [0.2.10 and 11] - 2026-01-14

### Added
- 

### Changed
- 

### Fixed
- Fixed new version detection 

### Removed
- 

---

## [0.2.9] - 2026-01-14

### Added
- 

### Changed
- 

### Fixed
- Fixed app version not bumping

### Removed
- 

---

## [0.2.9] - 2026-01-14

### Added
- 

### Changed
- 

### Fixed
- Fixed major issue where new version not being detected

### Removed
- 

---

## [0.2.8] - 2026-01-14

### Added
- [Ticket 9](https://github.com/Xenon1/NextUp/issues/9) - Added custom popups that only ask for confirmation if destructive

### Changed
- [Ticket 8](https://github.com/Xenon1/NextUp/issues/8) - Altered text in in show and anime details from **Currently Watching** to **Last Episode Watched**
- Provides EXE installer instead of MSI

### Fixed
- Fixed logic preventing episodes moving from watching to waiting for next episode

### Removed
- [Ticket 13](https://github.com/Xenon1/NextUp/issues/13) - Removed counters in the navigation bar

---

## [0.2.2 and 0.2.3] - 2026-01-10

### Added
- 

### Changed
- 

### Fixed
- Fixed build errors

### Removed
- 

---

## [0.2.1] - 2026-01-10

### Added
- 

### Changed
- 

### Fixed
- Fixed linting errors
- Fixed `npm run tauri-dev` not working

### Removed
- 

---

## [0.2.0] - 2026-01-10

### Added
- 

### Changed
- Testing release pipeline

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
