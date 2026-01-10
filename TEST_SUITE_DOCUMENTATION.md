# NextUp Unit Tests - Complete Test Suite

## Test Summary
**Total Tests: 76**
**Test Files: 11**
**Status: ✅ All Passing**

## Test Coverage by Component/Service

### 1. **ApiKeySetupModal** (6 tests)
- ✓ Renders modal with title and instructions
- ✓ Displays TMDB URL that can be clicked
- ✓ Has password input field for API key
- ✓ Has continue button
- ✓ Shows error message when submitting empty API key
- ✓ Displays security note about local storage

### 2. **SearchComponent** (2 tests)
- ✓ Renders search input
- ✓ Has onAddToWatchlist callback prop

### 3. **DashboardComponent** (3 tests)
- ✓ Renders dashboard section
- ✓ Accepts items prop
- ✓ Accepts onUpdate callback prop

### 4. **WatchlistComponent** (5 tests)
- ✓ Renders watchlist section
- ✓ Accepts items prop
- ✓ Accepts mediaType prop
- ✓ Accepts onUpdate callback prop
- ✓ Accepts onRemove callback prop

### 5. **TMDB Service** (7 tests)
- ✓ Initializes with API key
- ✓ Has searchMovies method
- ✓ Has searchTVShows method
- ✓ Has getMovieDetails method
- ✓ Has getTVShowDetails method
- ✓ Has getTVShowWithSeasons method
- ✓ Has setApiKey method

### 6. **Config Service** (5 tests)
- ✓ Has initialize method
- ✓ Has getApiKey method
- ✓ Has setApiKey method
- ✓ Has getConfig method
- ✓ Has saveConfig method

### 7. **Watchlist Storage** (4 tests)
- ✓ Creates watchlist item with correct structure
- ✓ Handles TV show items correctly
- ✓ Handles anime items correctly
- ✓ Allows updating watchlist item status

### 8. **Validation Utils** (13 tests)
- ✓ Validates complete watchlist item
- ✓ Rejects incomplete watchlist item
- ✓ Validates plan-to-watch status
- ✓ Validates watching status
- ✓ Validates waiting-for-next-ep status
- ✓ Validates on-hold status
- ✓ Validates dropped status
- ✓ Validates completed status
- ✓ Rejects invalid status
- ✓ Validates movie media type
- ✓ Validates tv media type
- ✓ Validates anime media type
- ✓ Rejects invalid media type

### 9. **Helper Utils** (12 tests)
- ✓ Calculates 50% progress
- ✓ Calculates 100% progress
- ✓ Calculates 0% progress
- ✓ Handles zero total episodes
- ✓ Rounds progress correctly
- ✓ Filters items by status
- ✓ Returns empty array for non-existent status
- ✓ Sorts items ascending by date
- ✓ Sorts items descending by date
- ✓ Does not modify original array
- ✓ Formats date string correctly
- ✓ Formats timestamp correctly

### 10. **Status Management Utils** (12 tests)
- ✓ Allows movie to transition to watching
- ✓ Prevents movie from transitioning to waiting-for-next-ep
- ✓ Allows TV show to transition to waiting-for-next-ep
- ✓ Allows anime to transition to waiting-for-next-ep
- ✓ Allows transitions to completed
- ✓ Allows transitions to dropped
- ✓ Allows transitions to on-hold
- ✓ Returns current status for movies in auto-status logic
- ✓ Transitions to waiting-for-next-ep when episode airs in future
- ✓ Stays watching when airing date passed
- ✓ Handles null airing date
- ✓ Works for anime with future airing date

### 11. **Utility Functions** (7 tests)
- ✓ Formats plan-to-watch status
- ✓ Formats watching status
- ✓ Formats waiting-for-next-ep status
- ✓ Formats on-hold status
- ✓ Formats dropped status
- ✓ Formats completed status
- ✓ Returns original string for unknown status

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI dashboard
npm run test:ui

# Run tests once and exit (CI mode)
npm run test -- --run
```

## Test Files Location
All test files are located in: `src/test/`

- `ApiKeySetupModal.test.tsx`
- `SearchComponent.test.tsx`
- `DashboardComponent.test.tsx`
- `WatchlistComponent.test.tsx`
- `tmdbService.test.ts`
- `configService.test.ts`
- `watchlistStorage.test.ts`
- `validation.test.ts`
- `helpers.test.ts`
- `statusManagement.test.ts`
- `utils.test.ts`

## Testing Framework
- **Framework**: Vitest 4.0.16
- **React Testing Library**: For component testing
- **jsdom**: DOM simulation environment
- **Coverage**: Ready for coverage reports

## Notes
- All tests use proper mocking for external dependencies (Tauri, Axios)
- Component tests verify prop acceptance and rendering
- Service tests verify method existence and basic functionality
- Utility tests provide comprehensive coverage of helper functions
- Tests follow React best practices and proper async handling
