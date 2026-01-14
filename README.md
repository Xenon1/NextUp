# 🎬 NextUp - Watch List Tracker

A beautiful Windows desktop application to track your movies, TV shows, and Anime. Built with Tauri, React and TypeScript

**[Getting Started](#getting-started)** • **[Features](#features)** • **[Releases](https://github.com/Xenon1/NextUp/releases)** • **[Changelog](https://github.com/Xenon1/NextUp/blob/main/CHANGELOG.md)**

## Features

✨ **Key Features:**
- 🔍 **Search & Discover** - Real-time search for movies, TV shows, and anime powered by TMDB
- 📋 **Smart Status System** - 6 statuses: Plan to Watch, Watching, Waiting for Next Ep, On Hold, Dropped, Completed
- 📺 **Episode Tracking** - Built-in tracking for TV show and anime seasons/episodes
- 🎬 **Auto-Transitions** - TV shows automatically transition to "Waiting for Next Episode" based on air dates
- 💾 **Complete Privacy** - All data stored locally (no cloud, no accounts, no tracking)
- 🔐 **Secure API Key Management** - First-run setup modal, config stored locally, never exposed
- ⚡ **Real-time Search** - Debounced search with instant results

## Tech Stack

- **Desktop Framework:** Tauri 2.9.5 (secure, lightweight)
- **Frontend:** React 19.2.0 + TypeScript 5.9.3
- **Build Tool:** Vite 7.3.1 (lightning-fast builds)
- **Backend:** Rust (performance & security)
- **Testing:** Vitest 4.0.16 with @testing-library/react (76 tests, all passing)
- **HTTP Client:** Axios (API requests)
- **API:** The Movie Database (TMDB) v3
- **Storage:** Local JSON files (~/.nextup/config.json, ~/.nextup/watchlist.json)
- **Styling:** CSS3 with dark mode
- **Linting:** ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Rust (for Tauri) - https://rust-lang.org/tools/install
- A free TMDB API key (get one [here](https://www.themoviedb.org/settings/api))

### Installation

Download the exe from the [Releases](https://github.com/Xenon1/NextUp/releases) page. 

> ⚠️ **IMPORTANT: When updating, choose "Do not uninstall"** to preserve all your watchlist data and settings. Uninstalling before updating may result in data loss.

#### Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Xenon1/NextUp.git
   cd NextUp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm run tauri-dev
   ```
   
   **On first run:** You'll see a setup modal asking for your TMDB API key
   - Go to https://www.themoviedb.org/settings/api to get a free API key
   - Enter it in the modal
   - The app securely saves it to `~/.nextup/config.json` (NOT in the repository)

4. **Build a standalone executable (optional):**
   ```bash
   npm run tauri-build
   ```
   The EXE installer will be in `src-tauri/target/release/bundle/nsis/`

## Usage

### Search & Add Items
1. Click the **"🔍 Search & Add"** tab
2. Select media type: Movies, TV Shows, or Anime
3. Enter search query (results appear as you type)
4. Click an item to see details
5. Click **"Add to Watchlist"** to save it

### Manage Your Watchlist
1. Click the **"🎬 Movie"**, **"📺 TV Shows" or **"🎨 Anime"**** tab
2. Browse items organized by status
3. **Change Status:** Click the status dropdown to update (Plan to Watch → Watching → Waiting for Next Ep, etc.)
4. **Remove Items:** Click the trash icon or "Remove" button
5. **Status Breakdown:** Count of items in each status
6. **Auto-Transitions:** TV shows automatically change status based on episode air dates

### Up Next Dashboard
The dashboard shows statistics:
- **Up Next:** Items you're currently watching that haven't aired yet
- **Airing Next:** Shows with upcoming episodes

## Project Structure

```
NextUp/
├── src/
│   ├── components/
│   │   ├── SearchComponent.tsx         # Search & discovery
│   │   ├── WatchlistComponent.tsx      # Watchlist management
│   │   ├── DashboardComponent.tsx      # Stats & overview
│   │   ├── ApiKeySetupModal.tsx        # First-run setup
│   │   └── *.css                       # Component styles
│   ├── services/
│   │   ├── tmdbService.ts             # TMDB API integration
│   │   ├── configService.ts           # Secure config management
│   │   └── watchlistStorage.ts        # Local data persistence
│   ├── utils/
│   │   ├── validation.ts              # Input validation
│   │   ├── helpers.ts                 # Utility functions
│   │   ├── statusManagement.ts        # Status logic
│   │   └── formatUtils.ts             # Data formatting
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── test/
│   │   ├── *.test.ts                  # 76 unit tests
│   │   ├── *.test.tsx                 # Component tests
│   │   └── setup.ts                   # Test configuration
│   ├── App.tsx                        # Main app component
│   └── main.tsx                       # Entry point
├── src-tauri/
│   ├── src/
│   │   └── lib.rs                     # Rust backend (config I/O)
│   └── Cargo.toml                     # Rust dependencies
├── public/                            # Static assets
├── .github/                           # GitHub workflows (optional)
├── vitest.config.ts                   # Test configuration
├── vite.config.ts                     # Build configuration
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript config
└── README.md                          # This file
```

## Available Scripts

```bash
npm run dev              # Start Vite dev server
npm run build            # Build React app for production
npm run tauri-dev        # Start Tauri dev (compiles Rust + React, launches app)
npm run tauri-build      # Build production desktop installer
npm run test             # Run test suite (Vitest watch mode)
npm run test:ui          # Run tests with Vitest UI dashboard
npm run lint             # Run ESLint checks
```

### Testing

The project includes a comprehensive test suit:

```bash
npm run test -- --run   # Run all tests once
npm run test:ui         # View tests in browser dashboard
```

## Data Storage

All your data is stored **locally** on your computer:

- **Config:** `C:\Users\{YourUsername}\.nextup\config.json` (API key)
- **Watchlist:** `C:\Users\{YourUsername}\.nextup\watchlist.json` (all items & status)

**Privacy & Security:**
- ✅ All data stays on your computer - zero cloud storage
- ✅ No account signup required
- ✅ API key stored locally, never exposed to the internet
- ✅ Only TMDB API calls go over the network
- ✅ Easy to backup: just copy the `~/.nextup/` folder
- ✅ Easy to migrate: copy `~/.nextup/` to another computer

**Configuration:**
The API key is managed securely via Tauri's backend:
- First run: Enter API key in setup modal
- Stored: In `~/.nextup/config.json` (not in the repository)
- Updated: Use the app's settings to change API key

## TMDB API

This app uses the free tier of TMDB API. For more information:
- **Website**: https://www.themoviedb.org/
- **API Docs**: https://developers.themoviedb.org/3
- **Rate Limit**: 40 requests per 10 seconds

## Troubleshooting

### App won't start or shows "API Key not found"
- **First run:** Click the setup modal button and enter your TMDB API key
- **After updates:** Delete `~/.nextup/config.json` and restart to reconfigure
- **Verify key:** Go to https://www.themoviedb.org/settings/api to confirm your API key is valid

### No search results appear
- Verify your internet connection
- Check that your TMDB API key is valid
- Try a different search term
- TMDB rate limit: 40 requests per 10 seconds

### App crashes or behaves unexpectedly
- Try clearing the app's cache: Delete `~/.nextup/` and restart (you'll need to re-enter your API key)
- Check that you're running the latest version
- Open an issue on GitHub with error details

### Tests fail locally
1. Verify Node.js version: `node --version` (should be v16+)
2. Clean install: `rm -r node_modules && npm install`
3. Run tests: `npm run test -- --run`
4. Check Rust: `rustc --version` (for Tauri builds)

### Can't build the app
1. Ensure Rust is installed: https://rust-lang.org/tools/install
2. Update npm: `npm install -g npm@latest`
3. Clean build: `npm run tauri-build`

## Contributing

Found a bug or have an idea? Contributions are welcome!

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Run `npm run test -- --run` and `npm run lint` before submitting PR
- Ensure `npm run build` succeeds
- Keep commit messages descriptive
- Add tests for new features
- Update README if adding new features

## Known Limitations

- **Windows only** - Currently built for Windows (Tauri can be extended to macOS/Linux)
- **TMDB free tier** - Limited to free API tier features
- **Episode auto-tracking** - TV show status transitions based on air dates, not actual watching
## License

MIT License - Feel free to use this project for personal or commercial purposes. See LICENSE file for details.

## Credits & Attributions

- **Movie Database**: [The Movie Database (TMDB)](https://www.themoviedb.org/) - All movie, TV, and anime data
- **Framework**: [Tauri](https://tauri.app/) - Secure, lightweight desktop framework
- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast frontend build tool
- **Testing**: [Vitest](https://vitest.dev/) - Unit testing framework

## Support & Questions

- 🐛 **Issues:** Open an issue on GitHub for bugs or features
- 💬 **Discussions:** Use GitHub Discussions for questions or ideas

---

**Made with ❤️**

If you found this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 🤝 Contributing improvements
- 📢 Sharing with others

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
