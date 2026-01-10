# 🚀 NextUp Quick Start Guide

## 5-Minute Setup

### Step 1: Install Rust (1 minute)
1. Download from: https://rust-lang.org/tools/install
2. Run the installer and follow prompts
3. Rust is required for Tauri to compile the desktop app

### Step 2: Get Your API Key (2 minutes)
1. Visit: https://www.themoviedb.org/settings/api
2. Sign up (free) or log in
3. Request an API key
4. Copy your key

### Step 3: Configure Your Project (1 minute)
1. Open the project folder
2. Create a file named `.env.local` in the root directory (same level as `package.json`)
3. Add this line:
   ```
   VITE_TMDB_API_KEY=paste_your_key_here
   ```
4. Replace `paste_your_key_here` with your actual API key

### Step 4: Start the App (1 minute)
1. Open PowerShell or Terminal in the project folder
2. Run:
   ```
   npm install
   npm run tauri-dev
   ```
3. The desktop app window will open automatically
4. That's it! You're ready to search and track your watchlist

## 🎬 Using NextUp

### Basic Workflow:
1. **Search** - Find movies, TV shows, or anime
   - Select media type (Movies, TV Shows, or Anime)
   - Type what you're looking for
   - Click search
   - Choose your status when adding (Plan to Watch, Watching, On Hold, Dropped, Completed)

2. **TV/Anime Tracking** - Track episodes and seasons
   - When you add a TV show or anime, seasons and episodes are automatically loaded
   - Use the Season and Episode dropdowns to track your progress
   - Click "Next" to advance to the next episode
   - When you finish a season, it automatically moves to the next season

3. **Watchlist Tabs** - Organize by media type
   - **🎬 Movies** - All your movies
   - **📺 TV Shows** - All TV shows with episode tracking
   - **🎨 Anime** - All anime with season/episode tracking
   - **🔍 Search & Add** - Find new items

4. **Manage Items** - Update status and notes
   - Change status: Click the status dropdown
   - Add notes: Write personal notes in the notes field
   - Remove: Click "Remove from Watchlist" button

### Pro Tips:
- Your data is saved automatically to `C:\Users\{YourUsername}\.nextup\watchlist.json`
- Try searching for specific titles, actors, or directors
- You can organize items into 5 categories for better tracking
- The rating shown is from TMDB's community
- Season/episode data is automatically fetched from TMDB

## 📁 File Structure

```
NextUp/
├── .env.local              ← Your API key goes here
├── .env.example            ← Example template
├── src/                    ← React app source code
├── src-tauri/              ← Rust backend (Tauri)
│   ├── src/                ← Rust source files
│   └── tauri.conf.json     ← Tauri configuration
├── package.json            ← Dependencies & scripts
└── vite.config.ts          ← Vite build config
```

## ❓ Common Issues

### "Rust not found"
- Install Rust from: https://rust-lang.org/tools/install
- Restart PowerShell after installation
- Run `rustup update` to ensure latest version

### "API Key Error"
- Make sure `.env.local` exists in the project root
- Check the API key is correct
- Restart Tauri dev server (`npm run tauri-dev`) after adding `.env.local`

### "No Search Results"
- Try a different search term
- Check your internet connection
- Verify TMDB API is responding

### "Data Lost or Not Saving"
- Check that `C:\Users\{YourUsername}\.nextup\` directory exists
- Verify the app has write permissions to your user directory
- Check for error messages in the console

## 🛠️ Commands

```bash
npm install        # Install all dependencies
npm run tauri-dev  # Start development (launches app window)
npm run tauri-build  # Build production executable
npm run build      # Build React for production
npm run lint       # Check code quality
```

## 📚 Learn More

- **Tauri**: https://tauri.app
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vite.dev
- **TMDB API**: https://developers.themoviedb.org/3
- **Rust**: https://www.rust-lang.org

## 🤝 Need Help?

Check the README.md for detailed documentation or review the code comments in the source files.

Happy watching! 🍿
