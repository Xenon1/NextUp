# 🎬 NextUp - Watch List Tracker

A beautiful Windows desktop application to track your movies, TV shows, and anime. Built with Tauri, React, TypeScript, and powered by The Movie Database (TMDB) API.

## Features

✨ **Key Features:**
- 🔍 Search and discover movies, TV shows, and anime
- 📋 Organize items into 5 statuses: Plan to Watch, Watching, On Hold, Dropped, Completed
- 📺 Episode & season tracking for TV shows and anime
- ⭐ See ratings and detailed information for each item
- 📝 Add personal notes to each entry
- 💾 All data saved to your computer (no cloud, complete privacy)
- 🎨 Beautiful dark mode UI
- 🌐 Real data from The Movie Database (TMDB)

## Tech Stack

- **Desktop Framework:** Tauri 2.0
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Backend:** Rust
- **HTTP Client:** Axios
- **API:** The Movie Database (TMDB) API
- **Storage:** Local JSON files in `~/.nextup/watchlist.json`
- **Styling:** CSS3 with dark mode

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Rust (for Tauri) - https://rust-lang.org/tools/install
- A free TMDB API key (get one [here](https://www.themoviedb.org/settings/api))

### Installation

1. **Navigate to the project:**
   ```bash
   cd NextUp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file in the project root:**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Or manually create .env.local with:
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

4. **Get your TMDB API Key:**
   - Go to https://www.themoviedb.org/settings/api
   - Sign up for a free account (if you don't have one)
   - Request an API key
   - Copy your API key to `.env.local`

5. **Start the Tauri development server:**
   ```bash
   npm run tauri-dev
   ```
   This will compile the Rust backend and launch the desktop app window.

6. **Build a standalone executable:**
   ```bash
   npm run tauri-build
   ```
   The built app will be in `src-tauri/target/release/bundle/msi/` (installable) or `src-tauri/target/release/` (portable)

## Usage

### Search & Add Items
1. Click on "🔍 Search & Add" tab
2. Select media type: Movies, TV Shows, or Anime
3. Enter your search query
4. Browse results and click "Add to Watchlist"

### Manage Your Watchlist
1. Click on "📋 My Watchlist" tab
2. View all your items organized by status
3. Change status: Click dropdown to mark as "To Watch", "Watching", or "Watched"
4. Add notes: Write personal notes about each item
5. Remove items: Click "Remove from Watchlist" button

### Dashboard Stats
Your watchlist header shows:
- **Total Items**: Number of items in your list
- **To Watch**: Items you haven't started
- **Watching**: Currently watching items
- **Watched**: Completed items
- **Avg Rating**: Average rating of all items

## Project Structure

```
NextUp/
├── src/
│   ├── components/
│   │   ├── SearchComponent.tsx      # Search functionality
│   │   ├── SearchComponent.css
│   │   ├── WatchlistComponent.tsx   # Watchlist display
│   │   └── WatchlistComponent.css
│   ├── services/
│   │   └── tmdbService.ts           # TMDB API integration
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── watchlistStorage.ts      # Local storage management
│   ├── App.tsx                      # Main App component
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── .env.example                     # Example environment variables
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start Vite dev server (used by Tauri)
- `npm run build` - Build React app for production
- `npm run tauri-dev` - Start Tauri development (compiles Rust + React)
- `npm run tauri-build` - Build production desktop app executable
- `npm run lint` - Run ESLint

## Data Storage

All your watchlist data is stored locally on your computer in a JSON file:
- **Location:** `C:\Users\{YourUsername}\.nextup\watchlist.json`
- ✅ Your data persists between app sessions
- ✅ No account signup required
- ✅ Complete privacy - nothing sent to external servers except TMDB API calls
- ✅ Data survives browser cache clearing (it's not in the browser)
- ✅ Easy to backup or transfer to another computer

## TMDB API

This app uses the free tier of TMDB API. For more information:
- **Website**: https://www.themoviedb.org/
- **API Docs**: https://developers.themoviedb.org/3
- **Rate Limit**: 40 requests per 10 seconds

## Future Features

Planned improvements:
- 🎬 Trailers and streaming availability
- 📊 Advanced filtering and sorting
- ☁️ Cloud sync with account
- 🎯 Recommendations based on your list
- 📱 Mobile app version
- 🌙 Dark/Light theme toggle
- 📈 Statistics and analytics

## Troubleshooting

### "Invalid API Key" error
- Ensure your TMDB API key is correctly set in `.env.local`
- Restart the development server after updating `.env.local`
- Check that `VITE_TMDB_API_KEY` is spelled correctly

### No search results
- Try a different search term
- Check your internet connection
- Verify TMDB API is working

### Data not persisting
- Check browser's Local Storage is enabled
- Try clearing browser cache and restarting
- Ensure you're not in private/incognito mode

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Credits

- **Movie Data**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Built with**: React, TypeScript, Vite
- **Inspired by**: Modern watchlist applications

---

**Made with ❤️ by Joe**

Need help? Open an issue or check the code comments for more details.

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
